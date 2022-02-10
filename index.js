const ethers = require('ethers');
const solc = require('solc');
const ganache = require('ganache-core');
const fs = require('fs');

const ganacheProvider = ganache.provider();

const provider = new ethers.providers.Web3Provider(ganacheProvider);

const signer0 = provider.getSigner(0);
const signer1 = provider.getSigner(1);

async function run() {
    const signerAddress0 = await signer0.getAddress();
    const signerAddress1 = await signer1.getAddress();

    console.log({ signerAddress0, signerAddress1 });

    const signer0Balance = await signer0.getBalance();

    console.log(signer0Balance);

    // 1. Compile the contract.
    const content = fs.readFileSync('./Contract.sol').toString();

    const input = {
        language: 'Solidity',
        sources: { 'Contract.sol': { content } },
        settings: { outputSelection: { '*': { '*': ['*'] } } }
    };

    const output = JSON.parse(solc.compile(JSON.stringify(input)));
    // console.log({ output })

    const { abi, evm: { bytecode: { object } } } = output.contracts['Contract.sol'].Contract;
    console.log({ abi });

    const contractFactory = new ethers.ContractFactory(abi, object, signer0);
    const contract = await contractFactory.deploy(50)

    const filter = contract.filters.Doubled(signerAddress0);

    contract.on(filter, (doubler, x) => {
        console.log(doubler, x);
    })

    contract.on('Doubled', (x) => {
        console.log('Doubled Trigger: ' + x.toString());
    })

    let x = await contract.x();

    console.log(x.toString());

    // View event emitted in txReceipt
    const tx = await contract.double();
    const txReceipt = await tx.wait();

    console.log({ tx });
    console.log({ txReceipt });

    x = await contract.x();

    console.log(x.toString());


}

// 2. Get ABI of the compiled contract.
// 3. Get the bytecode of the compiled contract.
// 4. Wire the ABI into ethers.js.
// 5. Deploy the bytecode to our local blockchain.

run();
