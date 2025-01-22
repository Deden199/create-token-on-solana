// src/services/solana.ts

import {
    Connection,
    PublicKey,
    SystemProgram,
    Transaction,
    Keypair,
  } from "@solana/web3.js";
  import {
    TOKEN_PROGRAM_ID,
    createInitializeMintInstruction,
    getAssociatedTokenAddress,
    createAssociatedTokenAccountInstruction,
    createMintToInstruction,
  } from "@solana/spl-token";
  import axios from "axios";
  import FormData from "form-data";
  import fs from "fs";
  
  interface UploadMetadataProps {
    tokenName: string;
    symbol: string;
    description: string;
    imageFile: fs.ReadStream;
  }
  
  export async function uploadMetadata({
    tokenName,
    symbol,
    description,
    imageFile,
  }: UploadMetadataProps): Promise<string> {
    try {
      // Verifikasi environment variables
      if (!process.env.PINATA_API_KEY || !process.env.PINATA_SECRET_API_KEY) {
        throw new Error("Required environment variables are not set.");
      }
  
      const pinataApiKey = process.env.PINATA_API_KEY;
      const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY;
  
      // Upload gambar ke Pinata
      const imageFormData = new FormData();
      imageFormData.append("file", imageFile);
  
      const imageResponse = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        imageFormData,
        {
          headers: {
            ...imageFormData.getHeaders(),
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataSecretApiKey,
          },
        }
      );
  
      const imageHash = imageResponse.data.IpfsHash;
      const imageUrl = `https://gateway.pinata.cloud/ipfs/${imageHash}`;
  
      // Upload metadata ke Pinata
      const metadata = { name: tokenName, symbol, description, image: imageUrl };
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
  
      const metadataUri = `https://gateway.pinata.cloud/ipfs/${metadataResponse.data.IpfsHash}`;
      return metadataUri;
    } catch (error: any) {
      console.error("Error in uploadMetadata:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || error.message);
    }
  }
  
  export async function createTokenFromPlatform({
    recipientPublicKey,
    tokenName,
    symbol,
    decimals,
    supply,
  }: {
    recipientPublicKey: string;
    tokenName: string;
    symbol: string;
    decimals: number;
    supply: number;
  }): Promise<{
    mintAddress: string;
    transactionSig: string;
  }> {
    try {
      if (!process.env.PLATFORM_PRIVATE_KEY) {
        throw new Error("Platform private key is not set.");
      }
  
      // Konversi private key string ke Keypair
      const privateKeyArray = process.env.PLATFORM_PRIVATE_KEY.split(",").map(Number);
      const platformKeypair = Keypair.fromSecretKey(new Uint8Array(privateKeyArray));
  
      const rpcUrl = process.env.SOLANA_RPC_URL;
      const connection = new Connection(rpcUrl, "confirmed");
  
      const mintKeypair = Keypair.generate();
      const rentExemption = await connection.getMinimumBalanceForRentExemption(82);
  
      // Create Mint Transaction
      const createMintTx = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: platformKeypair.publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: 82,
          lamports: rentExemption,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeMintInstruction(
          mintKeypair.publicKey,
          decimals,
          platformKeypair.publicKey,
          platformKeypair.publicKey
        )
      );
  
      createMintTx.feePayer = platformKeypair.publicKey;
      createMintTx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  
      // Tanda tangani transaksi menggunakan partialSign
      createMintTx.partialSign(platformKeypair, mintKeypair);
  
      const createMintSig = await connection.sendRawTransaction(createMintTx.serialize());
      await connection.confirmTransaction(createMintSig, "confirmed");
  
      console.log("Mint created:", createMintSig);
  
      // Create Associated Token Account (ATA) untuk penerima
      const recipientPubkey = new PublicKey(recipientPublicKey);
      const ataPublicKey = await getAssociatedTokenAddress(
        mintKeypair.publicKey,
        recipientPubkey
      );
  
      const createATATx = new Transaction().add(
        createAssociatedTokenAccountInstruction(
          platformKeypair.publicKey,
          ataPublicKey,
          recipientPubkey,
          mintKeypair.publicKey
        )
      );
  
      createATATx.feePayer = platformKeypair.publicKey;
      createATATx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  
      // Tanda tangani transaksi ATA menggunakan partialSign
      createATATx.partialSign(platformKeypair);
  
      const ataSig = await connection.sendRawTransaction(createATATx.serialize());
      await connection.confirmTransaction(ataSig, "confirmed");
  
      console.log("ATA created:", ataSig);
  
      // Mint tokens ke ATA
      const mintToTx = new Transaction().add(
        createMintToInstruction(
          mintKeypair.publicKey,
          ataPublicKey,
          platformKeypair.publicKey,
          supply * Math.pow(10, decimals)
        )
      );
  
      mintToTx.feePayer = platformKeypair.publicKey;
      mintToTx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  
      // Tanda tangani transaksi minting menggunakan partialSign
      mintToTx.partialSign(platformKeypair);
  
      const mintToSig = await connection.sendRawTransaction(mintToTx.serialize());
      await connection.confirmTransaction(mintToSig, "confirmed");
  
      console.log("Tokens minted:", mintToSig);
  
      return {
        mintAddress: mintKeypair.publicKey.toBase58(),
        transactionSig: mintToSig,
      };
    } catch (error: any) {
      console.error("Error in createTokenFromPlatform:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || error.message);
    }
  }
  