// src/components/CreateToken.tsx

import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

const CreateToken: React.FC = () => {
  const { publicKey, signTransaction } = useWallet();

  const [tokenName, setTokenName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [decimals, setDecimals] = useState<number>(9);
  const [supply, setSupply] = useState<number>(1000000);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [status, setStatus] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const [mintAddress, setMintAddress] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB
        alert("Image size should be less than 5MB.");
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setPreview(null);
    }
  };

  const handleCreateToken = async () => {
    if (!publicKey || !signTransaction) {
      alert("Please connect your Phantom wallet first!");
      return;
    }

    // Validasi Formulir
    if (!tokenName.trim() || !symbol.trim() || !description.trim() || !image) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      setIsLoading(true);
      setStatus("Uploading metadata...");

      // Unggah metadata melalui API route
      const formData = new FormData();
      formData.append("tokenName", tokenName);
      formData.append("symbol", symbol);
      formData.append("description", description);
      formData.append("imageFile", image); // Pastikan nama field adalah "imageFile"

      console.log("Form Data Preview:", Object.fromEntries(formData.entries()));

      const uploadResponse = await axios.post("/api/upload-metadata", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { metadataUri } = uploadResponse.data;
      setStatus("Metadata uploaded. Sending fee...");

      // Kirim 0.1 SOL dari pengguna ke platform wallet
      const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL as string, "confirmed");
      console.log("Checking user balance...");
      const userBalance = await connection.getBalance(publicKey);
      if (userBalance < 0.1 * LAMPORTS_PER_SOL) {
        alert("Your wallet balance is insufficient to pay the fee. Please top up your wallet.");
        return;
      }
      const platformWallet = new PublicKey(process.env.NEXT_PUBLIC_PLATFORM_WALLET_ADDRESS as string);
      const lamports = Math.floor(0.1 * LAMPORTS_PER_SOL); // 0.1 SOL

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

      console.log("Fee transfer succes:", feeSignature);
      setTxHash(feeSignature);
      setStatus("Fee transfer succes. Creating token...");

      // Buat token menggunakan API route
      const createTokenResponse = await axios.post("/api/create-token", {
        recipientPublicKey: publicKey.toBase58(),
        tokenName,
        symbol,
        decimals,
        supply,
      });

      const { mintAddress, transactionSig } = createTokenResponse.data;

      setMintAddress(mintAddress);
      setTxHash(transactionSig);
      setStatus("Token successfully created!");
    } catch (error: any) {
      console.error("Error in CreateToken:", error);
      if (error.response) {
        // Server responded dengan status lain selain 2xx
        setStatus(`Creation failed: ${error.response.data.message || error.response.statusText}`);
      } else if (error.request) {
        // Permintaan dibuat tapi tidak ada respons
        setStatus("Creation failed: No response from server.");
      } else {
        // Sesuatu yang lain terjadi
        setStatus(`Creation failed: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-12 px-6">
      <div className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Create Your SPL Token</h2>
        <p className="text-center text-gray-300 mb-8">
          Fill out the form below to create your own SPL Token with metadata.
        </p>
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium mb-2">Token Name</label>
            <input
              type="text"
              value={tokenName}
              onChange={(e) => setTokenName(e.target.value)}
              placeholder="e.g. SolradianToken"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Symbol</label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="e.g. SRD"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Decimals</label>
            <input
              type="number"
              value={decimals}
              onChange={(e) => setDecimals(Number(e.target.value))}
              min={0}
              max={9}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Total Supply</label>
            <input
              type="number"
              value={supply}
              onChange={(e) => setSupply(Number(e.target.value))}
              placeholder="1000000"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short description of your token."
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          {/* Enhanced Image Upload Field */}
          <div>
            <label className="block text-sm font-medium mb-2">Token Image</label>
            <div
              className="flex flex-col items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-600 rounded-lg bg-gray-700 hover:bg-gray-600 cursor-pointer transition"
              onClick={() => document.getElementById("imageUpload")?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file && file.type.startsWith("image/")) {
                  if (file.size > 5 * 1024 * 1024) {
                    alert("Image size should be less than 5MB.");
                    return;
                  }
                  setImage(file);
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setPreview(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                } else {
                  alert("Please upload a valid image file.");
                }
              }}
            >
              {preview ? (
                <img src={preview} alt="Preview" className="object-cover w-48 h-48 rounded" />
              ) : (
                <p className="text-gray-400">
                  Drag & drop an image here, or click to select a file
                </p>
              )}
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleCreateToken}
            disabled={isLoading}
            className={`w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-lg font-semibold text-white shadow-lg hover:from-cyan-400 hover:to-blue-500 transition ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Creating Token..." : "Create Token"}
          </button>
        </form>
        {status && (
          <p
            className={`mt-4 text-center ${
              status.toLowerCase().includes("failed") ? "text-red-500" : "text-gray-300"
            }`}
          >
            {status}
          </p>
        )}
        {txHash && (
          <p className="mt-4 text-center text-cyan-400">
            Transaction:{" "}
            <a
              href={`https://explorer.solana.com/tx/${txHash}?cluster=mainnet-beta`}
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              {txHash}
            </a>
          </p>
        )}
        {mintAddress && (
          <p className="mt-4 text-center text-cyan-400">
            Mint Address:{" "}
            <a
              href={`https://explorer.solana.com/address/${mintAddress}?cluster=mainnet-beta`}
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              {mintAddress}
            </a>
          </p>
        )}
        <p className="mt-6 text-center text-sm text-gray-500">
          A 0.1 SOL fee will be sent to Solradian's platform wallet for each creation.
        </p>
      </div>
    </div>
  );
};

export default CreateToken;
