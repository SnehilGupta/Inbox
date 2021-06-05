//yha hum real test network p deploy krng naki Inbox.test.js k trh jha sirf testing purpose k liy hua

const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const { abi, evm } = require("./compile");

const provider = new HDWalletProvider('half stamp spin genre science excite remind nation width tobacco excess creek',
'https://rinkeby.infura.io/v3/b914e5f6a4304dab942b532cb02a56e1');
const web3 = new Web3(provider);
const message = "Hi there!";

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log("Attempting to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(abi)
    .deploy({ data: "0x" + evm.bytecode.object, arguments: [message] })
    .send({ from: accounts[0] });

  console.log("Contract deployed to", result.options.address);

};

deploy();
