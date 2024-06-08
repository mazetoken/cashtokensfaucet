import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import helmet from "helmet";
import { Contract, ElectrumNetworkProvider } from "cashscript";
import artifact from "./public/tokenfaucet.json" assert { type: "json" };

const app = express();
app.use(helmet());
app.set('trust proxy', 1);

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
    res.render("index", { content: null, txIds: null, error: null });
});

app.post("/", async function (req, res) {
    const index = 0n;
    const period = 1;
    const contractPassword = process.env.CONTRACT_PASSWORD;
    const tokenAmount = process.env.TOKEN_AMOUNT;
    const tokenCategory = process.env.TOKEN_CATEGORY;
    let userAddress = req.body.userAddress;
    //const provider = new ElectrumNetworkProvider("chipnet"); //testnet
    const provider = new ElectrumNetworkProvider("mainnet");
    const addressType = "p2sh32";

    let contract = new Contract(artifact, [index, BigInt(period), BigInt(contractPassword), BigInt(tokenAmount)], { provider, addressType });

    if (userAddress = req.body.userAddress) {
        try {
            const tokenDetails = {
                amount: BigInt(tokenAmount),
                category: tokenCategory
            };
            
            const txData = await contract.functions.claimTokens(BigInt(contractPassword), BigInt(tokenAmount))
                .to(userAddress, 800n, tokenDetails)
                .withAge(period)
                .send()

        res.render("index", {
            content: "Done. Check the contract address.",
            txIds: contract.address,
            error: null
        });
        } catch (e) {
            res.render("index", {
                content: null,
                txIds: null,
                error: "Try again later."
            });
        }
    };
});

app.listen(process.env.PORT, () => {
    console.log("Server listening on port " + process.env.PORT + "!");
});