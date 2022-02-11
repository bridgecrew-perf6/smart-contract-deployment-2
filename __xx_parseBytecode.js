const { XMLHttpRequest } = require('xmlhttprequest');
const { EVM } = require("evm");
const { solc } = require("solc");
const fs = require('fs');

const BYTECODE_FILE = 'file://C:/Users/JasonGarcia24/CHAINSHOT/week_04/smart-contract-deployment/Contract_sol_Contract.bin'

const parseBytecode = (code) => {
    const _evm = new EVM(code);

    const _raw = code.replace(/.{100}/g, '$&' + "\n");
    const _decompiled = _evm.decompile();
    const _opcodes = _evm.getOpcodes().map(({ _name }, i) => `(${i}) ${_name}`).join('\n');

    console.log(_opcodes);
}

function readTextFile(file) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                var allText = rawFile.responseText;
                console.log(allText)

                parseBytecode(allText)
            }
        }
    }
    return rawFile.send(null);
}

// readTextFile(BYTECODE_FILE);

const input = {
    language: 'Solidity',
    sources: {
        'Contract.sol': {
            content: fs.readFileSync('Contract.sol', 'utf8'),
        }
    }
}

const output = solc()
