const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

async function main() {
  console.log(process.env.PRIVATE_KEY); // DEBUG
  console.log(process.env.PRIVATE_KEY_PASSWORD); // DEBUG

  // crrate the wallet and encrypt it with the password --> json file
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
  const encryptedJsonKey = await wallet.encrypt(
    process.env.PRIVATE_KEY_PASSWORD,
    process.env.PRIVATE_KEY
  );
  console.log(encryptedJsonKey); // DEBUG
  fs.writeFileSync("./.encryptedKey.json", encryptedJsonKey);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
