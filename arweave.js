import fs from 'fs';
import Bundlr from "@bundlr-network/client"

export async function upload3(data) {
    const bundlr = new Bundlr.default("https://node1.bundlr.network", "solana", process.env.KEY);

    const price = await bundlr.getPrice(data.length);
    // Get your current balance
    const balance = await bundlr.getLoadedBalance();
    
    // If you don't have enough balance for the upload
    if (balance.isLessThan(price)) {
        console.log("Balance: " + balance.toNumber());
        console.log("Price: " + price.toNumber());
        // Fund your account with the difference
        // We multiply by 1.1 to make sure we don't run out of funds
        let fundingAmount = (price - balance) * 1.1;
        console.log("ToFund: " + Math.floor(fundingAmount));
        await bundlr.fund(Math.floor(fundingAmount));
    }

    // create a Bundlr Transaction
    const tx = bundlr.createTransaction(data)

    // sign the transaction
    await tx.sign()
    // get the transaction's ID:
    const id = tx.id
    // upload the transaction
    const result = await tx.upload();
    console.log(result);

    return `https://arweave.net/${id}`;


}

export async function upload2(data) {

    // currencies with a keyfile: load + parse your keyfile as below:
    const key = JSON.parse(fs.readFileSync("./key/ar_spatium_key.json").toString());
    // other currencies without one - set key as your private key string
    console.log(key);

    // initialise a bundlr client
    const bundlr = new Bundlr.default("https://node1.bundlr.network", "arweave", key)

    // get your account address (associated with your private key)
    const address = bundlr.address

    // get your accounts balance
    const balance = await bundlr.getLoadedBalance();
    console.log(balance.toNumber());
    

    // convert it into decimal units
    const decimalBalance = bundlr.utils.unitConverter(balance)
    console.log(decimalBalance.toNumber());

    // create a Bundlr Transaction
    const tx = bundlr.createTransaction(data)

    // want to know how much you'll need for an upload? simply:
    // get the number of bytes you want to upload
    const size = tx.size
    // query the bundlr node to see the price for that amount
    const cost = await bundlr.getPrice(size);
    console.log("Cost: " + cost);

    // sign the transaction
    await tx.sign()
    // get the transaction's ID:
    const id = tx.id
    // upload the transaction
    const result = await tx.upload();
    console.log(result);

    return `https://arweave.net/${id}`;

}

// module.exports = {
//     upload: upload,
//     upload2: upload2
// }
