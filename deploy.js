// ganache rpc server: http://127.0.0.1:7545

const ethers = require("ethers")
const fs = require("fs-extra")
require("dotenv").config()

const ENCRYPTED = true

async function main() {
    let provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)

    var wallet
    if (!ENCRYPTED) {
        wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
    } else {
        const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8")
        wallet = new ethers.Wallet.fromEncryptedJsonSync(
            encryptedJson,
            process.env.PRIVATE_KEY_PASSWORD
        )
        wallet = wallet.connect(provider)
    }

    const abi = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.abi",
        "utf-8"
    )
    const binary = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.bin",
        "utf-8"
    )

    const contractFactory = new ethers.ContractFactory(abi, binary, wallet)
    console.log("Deploying, please wait...")
    const contract = await contractFactory.deploy()
    await contract.deployTransaction.wait(1)

    let currentFavoriteNumber = await contract.retrieve()
    console.log(`Current Favorite Number: ${currentFavoriteNumber}`)
    console.log("Updating favorite number...")
    let transactionResponse = await contract.store(7)
    let transactionReceipt = await transactionResponse.wait()
    currentFavoriteNumber = await contract.retrieve()
    console.log(`New Favorite Number: ${currentFavoriteNumber}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
