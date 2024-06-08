document.getElementById("blocksapi").onclick = async () => {
  try {
    const apiUrl = "https://sandbox-api.3xpl.com";
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const bchBlock = data.data.blockchains["bitcoin-cash"].best_block;
        const bchTime = data.data.blockchains["bitcoin-cash"].best_block_time;
        //console.log("Block: " + bchBlock + " " + bchTime.substr(0, 19));
        document.getElementById("block").textContent = "Block: " + bchBlock + " " + bchTime.substr(0, 19);
      });
      //.catch(error => {
        //console.error('Error fetching API data:', error);
      //});
  } catch (error) { alert(error) }
};