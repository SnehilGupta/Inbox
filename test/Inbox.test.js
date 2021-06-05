const assert = require("assert"); //Assert is used to write test cases for your apps to test your applications to see if they work as expected and catch errors early in the development stage
const ganache = require("ganache-cli"); //local blockchain testing network
const Web3 = require("web3"); //this is a constructor 'W' to create instances of web3 library, can create many instances to interact with different ethereum networks
const provider = Web3.givenProvider || ganache.provider(); //communication layer between web3 library and some ethereum network (consists of method to send a req and receive a response from network)
const web3 = new Web3(provider); //instance of web3(allow js to interact with ethereum blockchain)
const { abi, evm } = require("../compile");
/*
  MOCHA testing
  * test running framework to test any type of js code
  * frontend backend or ethereum
 */

const message = "Hi there!";
let accounts;
let inbox;

beforeEach(async () => {
  //every function in web3 is async in nature and returns a promise so we use
  // Get a list of all accounts using web3 from ganache
  accounts = await web3.eth.getAccounts();

  // Use one of those accounts to deploy the contract using bytecode.
  inbox = await new web3.eth.Contract(abi) //Contract is a constructor function which either interacts with existing contracts or to create and deploy and instance of contract first argument in Contract constructor is abi
    .deploy({ data: "0x" + evm.bytecode.object, arguments: [message] }) //tells web3 that we want to deploy an instance of contract bas aur kuch ni kaam is line ka, data m bytecode dia jata hai aura argument m jo Inbox.sol file m jo constructor bna h usm string arg dere h, array qki ek s zada arg hoske isliy
    .send({ from: accounts[0], gas: "1000000" }); //a txn is send using person's address and gas to be used to deploy the contract, yha deploy hota hai aur address generate ho
});

/*  ky ky tests hoskt h iske
  1. ky deploy proper hora h mtlb address develop hora h bc m is contract ka
  2. ky koi default value/message provide hori h deploy k bd contract ko
  3. ky hum msg chng krskt
*/

describe("Inbox", () => {
  it("deploys a contract", () => {
    assert.ok(inbox.options.address); //address of the deployed contract(txn complt k bd generate ho) in the BC jo k inbox->options->address m present h
    //assert.equal ki trh ek aur func h .ok, yeh func check krt h ky koi arg k trh value present h
  });

  it("has a default message", async () => {
    const msg = await inbox.methods.message().call(); //contract deploy k bd jo message() method jo automatic generate hua Inbox.sol se usk value ko check kre hum jo default msg hum upr deploy m pass kiy usee
    //yeh inbox->methods m milega sara method Inbox.sol ka
    //is method ko sirf .call() krng qki message k value fetch hori koi txn ni hora, txn tb ho jb kuch change kre hum jaise setMessage() func in Inbox.sol chng kra h kuch
    assert.equal(msg, message);
  });

  it("can change the message", async () => {
    const newMsg = "bye";
    await inbox.methods.setMessage(newMsg).send({ from: accounts[0] }); //methods jo Inbox.sol m bny h hmne wo inbox->methods m  milega sb methods
    //.send m hum kuch gas pass kre h qk yeh txn create krega qk chng kra phl txn krng fir call krng
    //setMessage m ek arg chah isliy newMsg pass kia
    //txn occur succesfully aur koi error throw ni hua toh success h mtlb isliy hum kisi var m store ni krng isko aur agr unsuccessful hua to error throw krega
    const msg = await inbox.methods.message().call(); //message public var h Inbox.sol m automatic func bnja uska return krd msg value
    assert.equal(msg, newMsg);
  });
});

//yah ek local test network p deploy hua ganache, testing purpose k liy ab hum real(test network ya main netowrk) p deploy krng rinkeby test network pe(main wale m real money lgega)
//isliy ab hum  deploy.js m code likhng 
