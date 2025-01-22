const { Keypair } = require('@solana/web3.js');

// Generate a new keypair
const keypair = Keypair.generate();

// Private Key
const privateKey = Buffer.from(keypair.secretKey).toString('hex');

// Public Key
const publicKey = keypair.publicKey.toString();

console.log("Public Key:", publicKey);
console.log("Private Key:", privateKey);
