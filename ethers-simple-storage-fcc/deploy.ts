// const { ethers, JsonRpcProvider } = require("ethers");
// const fs = require("fs-extra");
// require("dotenv").config();
import { ethers, JsonRpcProvider } from "ethers";
import * as fs from "fs-extra";
import "dotenv/config";

// http://127.0.0.1:7545

async function main() {
    const provider = new JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
    // const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8");
    // let wallet = ethers.Wallet.fromEncryptedJsonSync(
    //     encryptedJson,
    //     process.env.PRIVATE_KEY_PASSWORD
    // );
    // wallet = await wallet.connect(provider);
    const deploymentOptions = {
        gasLimit: 2000000,
    };
    const abi = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.json",
        "utf8"
    );
    const binary = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.bin",
        "utf8"
    );
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
    console.log("Deploying, please wait...");
    const contract = await contractFactory.deploy(deploymentOptions);
    await contract.deploymentTransaction().wait(1);
    const contractAddress = await contract.getAddress();
    console.log(`Contract Address: ${contractAddress}`);

    const currentFavoriteNumber = await contract.retrieve();
    console.log(`Current Favorite Number: ${currentFavoriteNumber.toString()}`);
    const transactionResponse = await contract.store("7");
    const transactionReceipt = await transactionResponse.wait(1);
    const updatedFavoriteNumber = await contract.retrieve();
    console.log(`Updated favorite number is: ${updatedFavoriteNumber}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
