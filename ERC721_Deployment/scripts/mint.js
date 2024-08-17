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
  const contractAddress = "0x3B895bC027151bFEDE8960d7D7714E8dF10CdF88"; 
  const recipientAddress = "0x2A1f16Eb5F5ecFb3F566e8C173a54aD338001910"; 

  const [signer] = await hre.ethers.getSigners();

  const contractFactory = await hre.ethers.getContractFactory("MyERC721Token");  
  const contract = contractFactory.attach(contractAddress);

  const functionName = "mint";
  const functionArgs = [recipientAddress]; 
  const txData = contract.interface.encodeFunctionData(functionName, functionArgs);

  try {
    console.log("Sent");

    const mintTx = await sendShieldedTransaction(
      signer,
      contractAddress,
      txData,
      0
    );

    await mintTx.wait();

    console.log("Done!");
    console.log("The receipt: ", mintTx);
  } catch (error) {
    console.error("Error: ", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});