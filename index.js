// sendTokenToWallets.js
// by Midas
// https://twitter.com/TheMoonMidas



// imports and requirements

const _ = require("lodash")
const Terra = require("@terra-money/terra.js");
let lcdClient, chainID;

// CONFIGURATION SECTION

// Set the mnemonic key of the wallet that will send the tokens
const mnemonicKey = "notice oak worry limit wrap speak medal online prefer cluster roof addict wrist behave treat actual wasp year salad speed social layer crew genius"

// Testnet? Set to false if doing stuff on mainnet
const testnet = true;

// Token contract you're interacting with
const tokenContract = "terra1747mad58h0w4y589y3sk84r5efqdev9q4r02pc" // ANC Testnet contract for example purposes

// Array of Wallets and amount to send:
// tokens amount is using six zeros as decimals, so 1000000 is in reality 1 ANC

const walletsToTransferTokensTo = [
    ["terra17lmam6zguazs5q5u6z5mmx76uj63gldnse2pdp", "1000000"],
    ["terra1757tkx08n0cqrw7p86ny9lnxsqeth0wgp0em95", "2000000"]
]


// END OF CONFIGURATION SECTION

// We check if it's testnet or not
if (testnet === true) { 
  lcdClient = "https://bombay-lcd.terra.dev" 
  chainID = "bombay-12"
} else {
  lcdClient = "https://lcd.terra.dev"
  chainID = "columbus-5"
}

// create a new client to interact with Terra's blockchain using the parameters from above
const terra = new Terra.LCDClient({
    URL: lcdClient,
    chainID: chainID,
});

// Mnemonic key
const mk = new Terra.MnemonicKey({
    mnemonic:
      mnemonicKey,
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
  console.log(result.txhash);
}).catch(err => {
    console.log(err);
});


