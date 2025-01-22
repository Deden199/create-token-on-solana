// src/pages/api/create-token.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { createTokenFromPlatform } from "../../services/solana";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const { recipientPublicKey, tokenName, symbol, decimals, supply } = req.body;

  // Validasi input
  if (
    !recipientPublicKey ||
    !tokenName ||
    !symbol ||
    decimals === undefined ||
    supply === undefined
  ) {
    console.error("Missing required fields:", {
      recipientPublicKey,
      tokenName,
      symbol,
      decimals,
      supply,
    });
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Log environment variable untuk debugging
    console.log("SOLANA_RPC_URL:", process.env.SOLANA_RPC_URL);

    // Pastikan SOLANA_RPC_URL terdefinisi dan valid
    if (
      !process.env.SOLANA_RPC_URL ||
      (!process.env.SOLANA_RPC_URL.startsWith("http://") &&
        !process.env.SOLANA_RPC_URL.startsWith("https://"))
    ) {
      console.error("Invalid or missing SOLANA_RPC_URL environment variable");
      return res
        .status(500)
        .json({ message: "Invalid Solana RPC URL configuration." });
    }

    // Panggil fungsi untuk membuat token
    const { mintAddress, transactionSig } = await createTokenFromPlatform({
      recipientPublicKey,
      tokenName,
      symbol,
      decimals,
      supply,
    });

    console.log("Token created successfully:", { mintAddress, transactionSig });

    return res.status(200).json({ mintAddress, transactionSig });
  } catch (error: any) {
    console.error("Error in create-token handler:", error);
    return res.status(500).json({ message: error.message || "Internal Server Error" });
  }
}
