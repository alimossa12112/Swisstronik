const hre = require("hardhat");
const { encryptDataField } = require("@swisstronik/utils");  

const sendShieldedTransaction = async (signer, destination, data, value) => {
  const rpcLink = hre.network.config.url;

  const [encryptedData] = await encryptDataField(rpcLink, data);

  return await signer.sendTransaction({
    from: signer.address,
    to: destination,
    data: encryptedData,
    value,
  });
};

async function main() {
  const contractAddress = "0x7d9e1d6E49FA464AD1Ec31c40804CfFB42c9d921";  
  const [signer] = await hre.ethers.getSigners();

  const contractFactory = await hre.ethers.getContractFactory("TestToken"); 
  const contract = contractFactory.attach(contractAddress);

  const functionName = "transfer";
  const recipientAddress = "0x16af037878a6cAce2Ea29d39A3757aC2F6F7aac1"; 
  const amount = (1 * (10 ** 18)).toString();

  const transaction = await sendShieldedTransaction(
    signer,
    contractAddress,
    contract.interface.encodeFunctionData(functionName, [recipientAddress, amount]),
    0
  );

  await transaction.wait();

  console.log("Transaction Response: ", transaction);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
