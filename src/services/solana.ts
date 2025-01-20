// src/services/solana.ts

import {
    Connection,
    PublicKey,
    SystemProgram,
    Transaction,
    TransactionSignature,
    Keypair,
    LAMPORTS_PER_SOL,
  } from '@solana/web3.js';
  import {
    TOKEN_PROGRAM_ID,
    createInitializeMintInstruction,
    getAssociatedTokenAddress,
    createAssociatedTokenAccountInstruction,
    createMintToInstruction,
  } from '@solana/spl-token';
  
  interface Props {
    publicKey: PublicKey;
    signTransaction: (tx: Transaction) => Promise<Transaction>;
    tokenName: string; // Informasi ini tidak disimpan secara default di SPL
    symbol: string;    // Informasi ini tidak disimpan secara default di SPL
    decimals: number;
    supply: number;
  }
  
  export async function sendSolFeeAndCreateToken({
    publicKey,
    signTransaction,
    tokenName,
    symbol,
    decimals,
    supply,
  }: Props): Promise<{ transactionSig: TransactionSignature; mintedTokenPubkey: string }> {
    try {
      console.log("Menginisialisasi koneksi ke Solana RPC...");
      const rpcUrl = `https://dark-black-seed.solana-mainnet.quiknode.pro/df2f3bde597639f8f7cbdbe7658aad8c56447300`; // Menggunakan API route Vercel
      if (!rpcUrl) {
        throw new Error('RPC Undefined.');
      }
      console.log(`Menggunakan RPC URL: ${rpcUrl}`);
      
      const connection = new Connection(rpcUrl, 'confirmed');
      
  
      // 1) Kirim 0.1 SOL fee ke platform wallet
      console.log("Menyiapkan transaksi untuk mengirim 0.1 SOL fee...");
      const platformWallet = new PublicKey('CPoKYe7fsWLkXMKwDnCh78NChd6a6HZEBE5JA5JvuCGs');
      const lamports = 0.1 * LAMPORTS_PER_SOL; // 0.1 SOL
  
      const feeTransferTx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: platformWallet,
          lamports,
        })
      );
  
      feeTransferTx.feePayer = publicKey;
      feeTransferTx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  
      console.log("Menandatangani transaksi fee transfer...");
      const signedFeeTransferTx = await signTransaction(feeTransferTx);
  
      console.log("Mengirim transaksi fee transfer...");
      const feeSignature = await connection.sendRawTransaction(signedFeeTransferTx.serialize());
      console.log(`Transaksi fee transfer dikirim dengan signature: ${feeSignature}`);
  
      console.log("Mengonfirmasi transaksi fee transfer...");
      await connection.confirmTransaction(feeSignature, 'confirmed');
      console.log("Transaksi fee transfer dikonfirmasi");
  
      // 2) Membuat SPL Token (Mint)
      console.log("Membuat SPL Token (Mint)...");
  
      // a. Buat Keypair untuk Mint Account
      const mintKeypair = Keypair.generate();
      const mintPublicKey = mintKeypair.publicKey;
  
      // b. Dapatkan rent exemption untuk akun mint
      const rentExemption = await connection.getMinimumBalanceForRentExemption(82); // 82 bytes untuk mint account
  
      // c. Buat instruksi untuk membuat akun mint
      const createMintAccountIx = SystemProgram.createAccount({
        fromPubkey: publicKey,
        newAccountPubkey: mintPublicKey,
        space: 82, // Ukuran akun mint
        lamports: rentExemption,
        programId: TOKEN_PROGRAM_ID,
      });
  
      // d. Buat instruksi untuk menginisialisasi mint
      const initializeMintIx = createInitializeMintInstruction(
        mintPublicKey, // Mint account
        decimals,      // Decimals
        publicKey,     // Mint authority
        publicKey      // Freeze authority
      );
  
      // e. Bangun transaksi untuk membuat dan menginisialisasi mint
      const createAndInitMintTx = new Transaction().add(
        createMintAccountIx,
        initializeMintIx
      );
  
      createAndInitMintTx.feePayer = publicKey;
      createAndInitMintTx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  
      console.log("Menandatangani transaksi pembuatan dan inisialisasi mint...");
      const signedCreateAndInitMintTx = await signTransaction(createAndInitMintTx);
  
      console.log("Mengirim transaksi pembuatan dan inisialisasi mint...");
      const mintSignature = await connection.sendRawTransaction(signedCreateAndInitMintTx.serialize());
      console.log(`Transaksi pembuatan dan inisialisasi mint dikirim dengan signature: ${mintSignature}`);
  
      console.log("Mengonfirmasi transaksi pembuatan dan inisialisasi mint...");
      await connection.confirmTransaction(mintSignature, 'confirmed');
      console.log("Transaksi pembuatan dan inisialisasi mint dikonfirmasi");
  
      // 3) Membuat Associated Token Account (ATA) untuk pengguna
      console.log("Membuat Associated Token Account (ATA) untuk pengguna...");
  
      const ataPublicKey = await getAssociatedTokenAddress(
        mintPublicKey,
        publicKey
      );
  
      // Buat instruksi untuk membuat ATA
      const createATAIx = createAssociatedTokenAccountInstruction(
        publicKey,      // Payer
        ataPublicKey,   // ATA
        publicKey,      // Owner
        mintPublicKey   // Mint
      );
  
      // Bangun transaksi untuk membuat ATA
      const createATATx = new Transaction().add(createATAIx);
      createATATx.feePayer = publicKey;
      createATATx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  
      console.log("Menandatangani transaksi pembuatan ATA...");
      const signedCreateATATx = await signTransaction(createATATx);
  
      console.log("Mengirim transaksi pembuatan ATA...");
      const ataSignature = await connection.sendRawTransaction(signedCreateATATx.serialize());
      console.log(`Transaksi pembuatan ATA dikirim dengan signature: ${ataSignature}`);
  
      console.log("Mengonfirmasi transaksi pembuatan ATA...");
      await connection.confirmTransaction(ataSignature, 'confirmed');
      console.log("Transaksi pembuatan ATA dikonfirmasi");
  
      // 4) Mint supply ke ATA
      console.log(`Minting ${supply} tokens ke ATA...`);
  
      const mintToIx = createMintToInstruction(
        mintPublicKey, // Mint
        ataPublicKey,  // Destination ATA
        publicKey,     // Mint authority
        supply * Math.pow(10, decimals) // Amount
      );
  
      const mintToTx = new Transaction().add(mintToIx);
      mintToTx.feePayer = publicKey;
      mintToTx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  
      console.log("Menandatangani transaksi minting...");
      const signedMintToTx = await signTransaction(mintToTx);
  
      console.log("Mengirim transaksi minting...");
      const mintToSignature = await connection.sendRawTransaction(signedMintToTx.serialize());
      console.log(`Transaksi minting dikirim dengan signature: ${mintToSignature}`);
  
      console.log("Mengonfirmasi transaksi minting...");
      await connection.confirmTransaction(mintToSignature, 'confirmed');
      console.log("Transaksi minting dikonfirmasi");
  
      return {
        transactionSig: mintToSignature,
        mintedTokenPubkey: mintPublicKey.toBase58(),
      };
    } catch (error: any) {
      console.error("Error di sendSolFeeAndCreateToken:", error);
      throw new Error(error.message);
    }
  }
  