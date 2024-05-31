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
    const period = 1n;
    const blocks = 1;
    const tokenAmount = 5000n;
    let userAddress = req.body.userAddress;
    const tokenCategory ="b3dd6dee4e783acd755d216dd39e34faae748c43927dcb82152b6c2affd57bab";
    //const provider = new ElectrumNetworkProvider("chipnet"); //testnet
    const provider = new ElectrumNetworkProvider("mainnet");
    const addressType = "p2sh32";

    let contract = new Contract(artifact, [index, period, tokenAmount], { provider, addressType });
    //console.log(contract);

    //console.log("Contract address: " + contract.address);
    //console.log("Contract address: " + contract.tokenAddress);

    const contractBal = await contract.getBalance();
    //console.log("Contract balance: " + contractBal);

    const utxos = await contract.getUtxos();
    //console.log(utxos);

    if (userAddress = req.body.userAddress) {
        try {
            const tokenDetails = {
                amount: tokenAmount,
                category: tokenCategory
            };
            
            const txData = await contract.functions.claimTokens()
                .to(userAddress, 800n, tokenDetails)
                .withAge(blocks)
                .send()
            //console.log(txData);

        res.render("index", {
            content: "You got 5000 ZOMBIE CashTokens!",
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