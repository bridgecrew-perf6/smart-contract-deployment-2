# Smart Contract Deployment<a id="Top-of-Page" />
A guide for learning how to analyze an unassisted smart contract deployment.
***
***
## Cotents<a id="Contents" />
0. [Project Description](#Project-Description)<br>
1. [Setup](#Setup)<br>
    - [Configure Persistent Blockchain](#-Configure-Persistent-Blockchain)<br>
    - [Configure Temporary Blockchain](#-Configure-Temporary-Blockchain)<br>
2. [Compilation](#Compilation)<br>
3. [Contributors](#Contributors)<br>
4. [License](#License)<br>
5. [Bottom of Page](#Bottom-of-Page)<br>
***
***
## Project Description<a id="Project-Description" />
***
***
## Setup<a id="Setup" />
To start, create a new project folder and `cd` into it.<br>

`$ mkdir ./smart-contract-deployment`<br>
`$ cd ./smart-contract-deployment`<br>

Next, create a `.env` and a `index.js` file in the root path of the project, which we will use later.<br>

`$ touch .env`<br>
`$ touch index.js`<br>
    
For our blockchain, a mnemonic will be used to allow us access to a consistent set of addresses. To quickly obtain an acceptable mnemonic, <a href="https://trufflesuite.com/docs/ganache/workspaces/the-quickstart-workspace" target="_blank">open a Quickstart Ethereum workspace</a> through the Ganache UI and copy the displayed mnemonic shown below (<strong>your mnemonic will be different</strong>). Or just copy mine...<br>

<img src="./img/ganache-mnemonic.png" alt="Ganache UI mnemonic example">

Now that we've copied our mnemonic, we can close the Ganache UI and paste the mnemonic into our .env we previously created. Your .env file should now look like the below.<br>
    
<img src="./img/env-mnemonic.png" alt=".env mnemonic">

Now we'll need to start our own local blockchain with Ganache. In order to do this, we can choose two different approaches, a [temporary](#-Configure-Temporary-Blockchain) or [persistent](#-Configure-Persistent-Blockchain) blockchain. Below I'll explain both and you can choose either one.
***
### Configure Persistent Blockchain<a id="-Configure-Persistent-Blockchain">
The following packages are required for this step. If they are not already installed, please do so now.
 - <a href="https://www.npmjs.com/package/ethers" target="_blank">`npm i ethers`</a>
    
#### Start Blockchain
[Configure Temporary Blockchain](#-Configure-Temporary-Blockchain)
#### Start Blockchain
Open a separate bash terminal and use the following to start up a local, persistent Ethereum blockchain.<br>
    
`$ ganache-cli -p 8555 --mnemonic "sausage devote speak supply top grunt middle section rabbit glow eagle history"`<br>
    
<b>Note</b>: The `-p` paramter sets the port for this particular application. <strong>This is optional</strong>. I like to use "8555" because the default for Ganache UI and CLI is "8545". Setting this to be different from the default allows us to open another Ganache Ethereum blockchain instance should we want (i.e., Ganache UI or Ganache temporary).
    
Within your terminal, you should now see 10 generated accounts with a generous 100 ETH each, as shown below. You can also verify the mnemonic and port number via the cli output.<br>

<b>Note</b>: The RPC server location is shown as `http:127.0.0.1:8555`.<br>
    
<img src="./img/ganache-cli-startup.png" alt="ganache-cli bash startup">
    
#### Configure JSON-RPC Provider
Now that we have a running local blockchain, we now need to configure our RPC provider using the <a href="https://docs.ethers.io/v5/api/providers/jsonrpc-provider/#JsonRpcProvider" target="_blank">JsonRpcProvider API method</a> provided by ethers.js.
    
Open the `index.js` previously created and import the JsonRpcProvider method.<br>
    
```js
const { ethers: { providers: { JsonRpcProvider } } } = require('ethers');
```

Now that we have the JsonRpcProvider method, we can create a new instance of the RPC provider at our persistent blockchain's url (i.e., <code>new ethers.providers.JsonRpcProvider( \[ <strong>url</strong>OrConnectionInfo \[ , networkish \] \] )</code>).<br>

```js
let provider;
provider = new JsonRpcProvider('http://127.0.0.1:8555');
```

#### Verify RPC Provider Connection
To verify our provider is set and communicating with our persistent local blockchain, we can query the associated <a href="https://docs.ethers.io/v5/api/providers/jsonrpc-provider/#JsonRpcSigner" target="_blank">JsonRpcSigners</a> and compare their public addresses to the addresses created from our mnemonic. To do so, we will use the JsonRpcProvider.getSigner() method with indexes of 0 and 4 (<code>jsonRpcProvider.getSigner( \[ addressOr<strong>Index</strong> \] )</code>).<br>

```js
const signer0 = provider.getSigner(0);
const signer4 = provider.getSigner(4);
```

Now that we have the signers, we can utilize the Signer.getAddress() method JsonRpcSigner inherits from <a href="https://docs.ethers.io/v5/api/signer/#Signer" target="_blank">Signer</a>. Signer.getAddress() will return a promise, so we will need to handle the response asynchronously and output it to our console:

```js
signer0.getAddress()
    .then((address) => console.log('signer0: ', address))
signer4.getAddress()
    .then((address) => console.log('signer4: ', address))
```

We can then run `index.js` file and generate the outputs displayed below. To do this, open a new bash terminal at the project's root path and run `node index.js`. <b>Note</b>: Going forward, we use this bash terminal for our commands.<br>

<img src="./img/json-rpc-provider-verify.png" alt="json rpc provider verification with console">

When we compare the console outputs to the "Available Accounts" shown at the start of the persistent Ganache terminal, we can confirm that the accounts are exact. This test can be repeated for all remaining 8 accounts, but this is not necessary.

##### index.js Checkpoint
```js
// Import deconstructed JsonRpcProvider
const { ethers: { providers: { JsonRpcProvider } } } = require('ethers');

// Connect to a JSON-RPC HTTP API using the URL
let provider;
provider = new JsonRpcProvider('http://127.0.0.1:8555');

// Verify JSON-RPC Provider connection
const signer0 = provider.getSigner(0);
const signer4 = provider.getSigner(4);

signer0.getAddress()
    .then((address) => console.log('signer0: ', address))
signer4.getAddress()
    .then((address) => console.log('signer4: ', address))
```
***
### Configure Temporary Blockchain<a id="-Configure-Temporary-Blockchain" />
The following packages are required for this step. If they are not already installed, please do so now.
 - <a href="https://www.npmjs.com/package/dotenv" target="_blank">`npm i dotenv`</a>
 - <a href="https://www.npmjs.com/package/ethers" target="_blank">`npm i ethers`</a>
 - <a href="https://www.npmjs.com/package/ganache-core" target="_blank">`npm i ganache-core`</a>
   
#### Configure JSON-RPC Provider
For the temporary blockchain, we will need to open the `index.js` file previously created to configure our RPC provider using the <a href="https://docs.ethers.io/v5/api/providers/other/#Web3Provider" target="_blank">Web3Provider API method</a> provided by ethers.js.<br>
    
Open the `index.js` previously created and import the ethers library, the ganache-core library, and the Web3Provider method.<br>

```js
const ethers = require('ethers');
const ganache = require('ganache-core');
const { ethers: { providers: { Web3Provider } } } = require('ethers');
```
    
Also, access your .env with the following:<br>

```js
require('dotenv').config()
```
    
Now we will need to instantiate a Ganache Web3 Provider API and wrap it with a ethers.js Web3Provider. This will expose the ethers.js API from our Ganache Web3 Provider. We will also instatiate our Ganache Web3 Provider with our mnemonic, which we previously copied into our .env file.
    
```js
const ganacheProvider = ganache.provider({
    mnemonic: process.env.MNEMONIC
});

let provider;
provider = new Web3Provider(ganacheProvider);
```

#### Verify RPC Provider Connection
To verify our provider is set and communicating with our temporary local blockchain, we can query the associated <a href="https://docs.ethers.io/v5/api/providers/jsonrpc-provider/#JsonRpcSigner" target="_blank">JsonRpcSigners</a> and compare their public addresses to the addresses created from our mnemonic. To do so, we will use the JsonRpcProvider.getSigner() method with indexes of 0 and 4 (<code>jsonRpcProvider.getSigner( [ addressOr<strong>Index</strong> ] )</code>).<br>

```js
const signer0 = provider.getSigner(0);
const signer4 = provider.getSigner(4);
```

Now that we have the signers, we can utilize the Signer.getAddress() method JsonRpcSigner inherits from <a href="https://docs.ethers.io/v5/api/signer/#Signer" target="_blank">Signer</a>. Signer.getAddress() will return a promise, so we will need to handle the response asynchronously and output it to our console:

```js
signer0.getAddress()
    .then((address) => console.log('signer0: ', address))
signer4.getAddress()
    .then((address) => console.log('signer4: ', address))
```

We can then run `index.js` file and generate the outputs displayed below. To do this, open a new bash terminal at the project's root path and run `node index.js`. <b>Note</b>: Going forward, we use this bash terminal for our commands.<br>

<img src="./img/json-rpc-provider-verify.png" alt="json rpc provider verification with console">

When we compare the console outputs to the "Available Accounts" shown on our Ganache UI, we can confirm that the accounts are exact. This test can be repeated for all remaining 8 accounts, but this is not necessary.
    
##### index.js Checkpoint
```js
// Import deconstructed JsonRpcProvider
const ethers = require('ethers');
const ganache = require('ganache-core');
const { ethers: { providers: { Web3Provider } } } = require('ethers');
    
// Access environment variables
require('dotenv').config();

// Connect to a JSON-RPC HTTP API
const ganacheProvider = ganache.provider({
    mnemonic: process.env.MNEMONIC
});

let provider;
provider = new Web3Provider(ganacheProvider);

// Verify JSON-RPC Provider connection
const signer0 = provider.getSigner(0);
const signer4 = provider.getSigner(4);

signer0.getAddress()
    .then((address) => console.log('signer0: ', address))
signer4.getAddress()
    .then((address) => console.log('signer4: ', address)) 
```
***
## Compilation<a id=#Compilation />
At compilation, the Solidity Compiler (solc) produces an Application Binary Interface (ABI) and bytecode.
***
## Contributors<a id="Contributors" />
Currently just me :)<br>
***
## License<a id="License" />
Each file included in this repository is licensed under the <a href="https://github.com/jasonjgarcia24/fintech-analytics-toolbox/blob/main/LICENSE" title="github.com/jasonjgarcia24/fintech-analytics-toolbox/blob/main/LICENSE">MIT License.</a>
***
[Top of Page](#Top-of-Page)<br>
[Contents](#Contents)<br>
[Project Description](#Project-Description)<br>
[Technologies](#Technologies)<br>
[Installation Guide](#Installation-Guide)<br>
[Usage](#Usage)<br>
[Contributors](#Contributors)<br>
[License](#License)<br>
<a id="Bottom-of-Page" />