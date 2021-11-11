// Node.js

// imports and requirements

const _ = require("lodash")

/*
import {
    LCDClient,
    MnemonicKey,
    MsgExecuteContract
  } from "@terra-money/terra.js";
*/

const Terra = require("@terra-money/terra.js");

// Token contract

const tokenContract = "terra14z56l0fp2lsf86zy3hty2z47ezkhnthtr9yq76" // ANC contract for example purposes

// Array of Wallets and amount to send:
// tokens amount is using six zeros as decimals, so 1000000 is in reality 1 ANC

const walletsToTransferTokensTo = [
    ["terra1...", "1000000"],
    ["terra1...", "2000000"]
]

// connect to LCDClient
const terra = new Terra.LCDClient({
    URL: 'https://lcd.terra.dev',
    chainID: 'columbus-5',
  });


// Mnemonic key
const mk = new Terra.MnemonicKey({
    mnemonic:
      '',
  });


// Start sequence to airdrop to all wallet:

const wallet = terra.wallet(mk);
let txMessages = [];

// Loop through all the wallets that you'll send your token to
for (let i=0; i < walletsToTransferTokensTo.length; i++) {
  // create a new message, we will send several of these messages in an array and put it in one transaction
    let msg = new Terra.MsgExecuteContract(
        wallet.key.accAddress,
        tokenContract,
        {
            "transfer": { 
            "amount": walletsToTransferTokensTo[i][1],
            "recipient": walletsToTransferTokensTo[i][0]
          }
        }
    );
    txMessages.push(msg);
}

// we'll be sending this in chunks of 50 messages, otherwise it'll be too much
const msgChunk = _.chunk(txMessages, 50);

// we create and sign the Transaction
// TODO: This needs to be done in a loop so it replaces msgChunk[0] with msgChunk[i]
// although not sure if this will work as it might need to be done in an async way
wallet.createAndSignTx({
  gasAdjustment: 1.5,
  gasPrices: "1.000000uusd",
  msgs: msgChunk[0],
  memo: ''
}).then(tx => terra.tx.broadcast(tx))
.then(result => {
  console.log(result);
}).catch(err => {
    console.log(err);
});


