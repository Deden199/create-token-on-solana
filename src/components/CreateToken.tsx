import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { sendSolFeeAndCreateToken } from "../services/solana";

const CreateToken: React.FC = () => {
  const { publicKey, signTransaction } = useWallet();

  const [tokenName, setTokenName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [decimals, setDecimals] = useState<number>(9);
  const [supply, setSupply] = useState<number>(1000000);

  const [status, setStatus] = useState("");
  const [txHash, setTxHash] = useState("");
  const [mintAddress, setMintAddress] = useState("");

  const handleCreateToken = async () => {
    if (!publicKey || !signTransaction) {
      alert("Please connect your Phantom wallet first!");
      return;
    }

    if (!tokenName.trim()) {
      alert("Token Name is required.");
      return;
    }
    if (!symbol.trim()) {
      alert("Symbol is required.");
      return;
    }
    if (decimals < 0 || decimals > 9) {
      alert("Decimals must be between 0 and 9.");
      return;
    }
    if (supply <= 0) {
      alert("Supply must be greater than 0.");
      return;
    }

    try {
      setStatus("Processing transaction...");
      const { transactionSig, mintedTokenPubkey } = await sendSolFeeAndCreateToken({
        publicKey,
        signTransaction,
        tokenName: tokenName.trim(),
        symbol: symbol.trim(),
        decimals,
        supply,
      });
      setStatus("Token successfully created!");
      setTxHash(transactionSig);
      setMintAddress(mintedTokenPubkey);
    } catch (error: any) {
      if (error.message.includes("User rejected the request")) {
        setStatus("Transaction canceled by the user.");
      } else {
        console.error("Error in CreateToken:", error);
        setStatus(`Creation failed: ${error.message}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-12 px-6">
      <div className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Create Your SPL Token</h2>
        <p className="text-center text-gray-300 mb-8">
          Specify your token's name, symbol, decimals, and total supply below.
        </p>
        <form className="space-y-6">
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
          <button
            type="button"
            onClick={handleCreateToken}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-lg font-semibold text-white shadow-lg hover:from-cyan-400 hover:to-blue-500 transition"
          >
            Create Token
          </button>
        </form>
        {status && (
          <p
            className={`mt-4 text-center ${
              status.includes("canceled") ? "text-yellow-500" : "text-gray-300"
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
