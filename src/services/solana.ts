// src/services/solana.ts

import {
    Connection,
    PublicKey,
    SystemProgram,
    Transaction,
    TransactionSignature,
    Keypair,
    LAMPORTS_PER_SOL,
  } from "@solana/web3.js";
  import {
    TOKEN_PROGRAM_ID,
    createInitializeMintInstruction,
    getAssociatedTokenAddress,
    createAssociatedTokenAccountInstruction,
    createMintToInstruction,
  } from "@solana/spl-token";
  import axios from "axios";
  
  interface Props {
    publicKey: PublicKey;
    signTransaction: (tx: Transaction) => Promise<Transaction>;
    tokenName: string;
    symbol: string;
    decimals: number;
    supply: number;
    description: string;
    imageFile: File;
  }
  
  export async function sendSolFeeAndCreateToken({
    publicKey,
    signTransaction,
    tokenName,
    symbol,
    decimals,
    supply,
    description,
    imageFile,
  }: Props): Promise<{
    transactionSig: TransactionSignature;
    mintedTokenPubkey: string;
  }> {
    try {
      console.log("Initializing connection to Solana RPC...");
      const rpcUrl = `https://dark-black-seed.solana-mainnet.quiknode.pro/df2f3bde597639f8f7cbdbe7658aad8c56447300`;
      const connection = new Connection(rpcUrl, "confirmed");
  
      // 1. Upload Metadata to Pinata
      console.log("Uploading metadata to Pinata...");
      const pinataApiKey = process.env.REACT_APP_PINATA_API_KEY;
      const pinataSecretApiKey = process.env.REACT_APP_PINATA_SECRET_API_KEY;
  
      if (!pinataApiKey || !pinataSecretApiKey) {
        throw new Error("Pinata API keys are not set.");
      }
  
      // Upload image to Pinata
      const imageFormData = new FormData();
      imageFormData.append("file", imageFile);
  
      const imageResponse = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        imageFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataSecretApiKey,
          },
        }
      );
  
      const imageHash = imageResponse.data.IpfsHash;
      const imageUrl = `https://gateway.pinata.cloud/ipfs/${imageHash}`;
      console.log("Image successfully uploaded to Pinata:", imageUrl);
  
      // Upload metadata to Pinata
      const metadata = {
        name: tokenName,
        symbol: symbol,
        description: description,
        image: imageUrl,
      };
  
      const metadataResponse = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        metadata,
        {
          headers: {
            "Content-Type": "application/json",
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataSecretApiKey,
          },
        }
      );
  
      const metadataHash = metadataResponse.data.IpfsHash;
      const metadataUri = `https://gateway.pinata.cloud/ipfs/${metadataHash}`;
      console.log("Metadata successfully uploaded to Pinata:", metadataUri);
  
      // 2. Send Fee 0.1 SOL
      console.log("Sending 0.1 SOL fee to platform wallet...");
      const platformWallet = new PublicKey(
        "CPoKYe7fsWLkXMKwDnCh78NChd6a6HZEBE5JA5JvuCGs"
      );
      const lamports = Math.floor(0.1 * LAMPORTS_PER_SOL);
  
      const feeTransferTx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: platformWallet,
          lamports,
        })
      );
  
      feeTransferTx.feePayer = publicKey;
      feeTransferTx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  
      const signedFeeTransferTx = await signTransaction(feeTransferTx);
      const feeSignature = await connection.sendRawTransaction(
        signedFeeTransferTx.serialize()
      );
      await connection.confirmTransaction(feeSignature, "confirmed");
  
      console.log("Fee transfer successful:", feeSignature);
  
      // 3. Create Token Mint
      console.log("Creating SPL Token (Mint)...");
      const mintKeypair = Keypair.generate();
      const mintPublicKey = mintKeypair.publicKey;
  
      const rentExemption = await connection.getMinimumBalanceForRentExemption(
        82
      );
  
      const createMintAccountIx = SystemProgram.createAccount({
        fromPubkey: publicKey,
        newAccountPubkey: mintPublicKey,
        space: 82,
        lamports: rentExemption,
        programId: TOKEN_PROGRAM_ID,
      });
  
      const initializeMintIx = createInitializeMintInstruction(
        mintPublicKey,
        decimals,
        publicKey,
        publicKey
      );
  
      const createAndInitMintTx = new Transaction().add(
        createMintAccountIx,
        initializeMintIx
      );
  
      createAndInitMintTx.feePayer = publicKey;
      createAndInitMintTx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  
      const signedCreateAndInitMintTx = await signTransaction(
        createAndInitMintTx
      );
      const mintSignature = await connection.sendRawTransaction(
        signedCreateAndInitMintTx.serialize()
      );
      await connection.confirmTransaction(mintSignature, "confirmed");
  
      console.log("Mint created successfully:", mintSignature);
  
      // 4. Create ATA (Associated Token Account)
      console.log("Creating Associated Token Account (ATA)...");
      const ataPublicKey = await getAssociatedTokenAddress(
        mintPublicKey,
        publicKey
      );
  
      const createATAIx = createAssociatedTokenAccountInstruction(
        publicKey,
        ataPublicKey,
        publicKey,
        mintPublicKey
      );
  
      const createATATx = new Transaction().add(createATAIx);
      createATATx.feePayer = publicKey;
      createATATx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  
      const signedCreateATATx = await signTransaction(createATATx);
      const ataSignature = await connection.sendRawTransaction(
        signedCreateATATx.serialize()
      );
      await connection.confirmTransaction(ataSignature, "confirmed");
  
      console.log("ATA created successfully:", ataSignature);
  
      // 5. Mint Token to ATA
      console.log(`Minting ${supply} tokens to ATA...`);
      const mintToIx = createMintToInstruction(
        mintPublicKey,
        ataPublicKey,
        publicKey,
        supply * Math.pow(10, decimals)
      );
  
      const mintToTx = new Transaction().add(mintToIx);
      mintToTx.feePayer = publicKey;
      mintToTx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  
      const signedMintToTx = await signTransaction(mintToTx);
      const mintToSignature = await connection.sendRawTransaction(
        signedMintToTx.serialize()
      );
      await connection.confirmTransaction(mintToSignature, "confirmed");
  
      console.log("Minting successful:", mintToSignature);
  
      return {
        transactionSig: mintToSignature,
        mintedTokenPubkey: mintPublicKey.toBase58(),
      };
    } catch (error: any) {
      console.error("Error in sendSolFeeAndCreateToken:", error);
      throw new Error(error.message);
    }
  }
  