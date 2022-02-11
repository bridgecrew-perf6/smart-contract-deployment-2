require('dotenv').config();

const ethers = require('ethers');
const ganache = require('ganache-core');
const { ethers: { providers: { Web3Provider } } } = require('ethers');

const ganacheProvider = ganache.provider({
    mnemonic: process.env.MNEMONIC
});

let provider;
provider = new Web3Provider(ganacheProvider);

const signer0 = provider.getSigner(0);
const signer4 = provider.getSigner(4);

// let provider;
// switch (DEFAULT_NETWORK) {
//     case 'GANACHE':
//         provider = new JsonRpcProvider(`http://127.0.0.1:8555`);
//         break;
//     case 'GANACHE-CORE':
//         const ganacheProvider = ganache.provider();
//         provider = new ethers.providers.Web3Provider(ganacheProvider);
//         break;
// }

// const { ethers: { providers: { JsonRpcProvider } } } = require('ethers');

// let provider;
// provider = new JsonRpcProvider(`http://127.0.0.1:8555`);

// const signer0 = provider.getSigner(0);
// const signer4 = provider.getSigner(4);

signer0.getAddress()
    .then((address) => console.log('signer0: ', address))
signer4.getAddress()
    .then((address) => console.log('signer4: ', address))



// const ethers = require('ethers');
// const solc = require('solc');
// const ganache = require('ganache-core');
// const fs = require('fs');
// const { DEFAULT_NETWORK, RPC_PORT } = require('./config');



// async function run() {
//     const signerAddress0 = await signer0.getAddress();
//     const signerAddress1 = await signer1.getAddress();

//     console.log({ signerAddress0, signerAddress1 });

//     const signer0Balance = await signer0.getBalance();

//     console.log(signer0Balance);

//     // 1. Compile the contract.
//     const content = fs.readFileSync('./Contract.sol').toString();
//     console.log(content)

//     const input = {
//         language: 'Solidity',
//         sources: { 'Contract.sol': { content } },
//         settings: { outputSelection: { '*': { '*': ['*'] } } }
//     };

//     const output = JSON.parse(solc.compile(JSON.stringify(input)));
//     // console.log({ output })

//     const { abi, evm: { bytecode: { object } } } = output.contracts['Contract.sol'].Contract;

//     // console.log({ abi });
//     // console.log({ object })

//     const contractFactory = new ethers.ContractFactory(abi, object, signer0);
//     const contract = await contractFactory.deploy(50)

//     const filter = contract.filters.Doubled(signerAddress0);

//     contract.on(filter, (doubler, x) => {
//         console.log(doubler, x);
//     })

//     contract.on('Doubled', (x) => {
//         console.log('Doubled Trigger: ' + x.toString());
//     })

//     let x = await contract.x();

//     console.log(x.toString());

//     // View event emitted in txReceipt
//     const tx = await contract.double();
//     const txReceipt = await tx.wait();

//     console.log({ tx });
//     console.log({ txReceipt });

//     x = await contract.x();

//     console.log(x.toString());


// }

// // 2. Get ABI of the compiled contract.
// // 3. Get the bytecode of the compiled contract.
// // 4. Wire the ABI into ethers.js.
// // 5. Deploy the bytecode to our local blockchain.

// run();
