// src/pages/api/upload-metadata.ts

import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import { uploadMetadata } from "../../services/solana";

// Disable Next.js default body parser untuk mendukung unggahan file
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function untuk parsing form data menggunakan formidable
const parseForm = (req: NextApiRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const uploadDir = "/tmp"; // Gunakan direktori /tmp langsung

  const form = formidable({
    multiples: false, // Hanya mengizinkan satu file
    uploadDir, // Direktori unggahan
    keepExtensions: true, // Menyimpan ekstensi file
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        resolve({ fields, files });
      }
    });
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    // Parsing form data
    const { fields, files } = await parseForm(req);

    // Log received fields and files
    console.log("Received Fields:", fields);
    console.log("Received Files:", files);

    // Ekstrak nilai dari fields, handle jika mereka adalah array
    const tokenName = Array.isArray(fields.tokenName) ? fields.tokenName[0] : fields.tokenName;
    const symbol = Array.isArray(fields.symbol) ? fields.symbol[0] : fields.symbol;
    const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;

    // Validasi input fields
    if (!tokenName || !symbol || !description) {
      console.error("Missing required fields:", { tokenName, symbol, description });
      return res.status(400).json({ message: "Missing required fields: tokenName, symbol, or description" });
    }

    // Ekstrak file, handle jika mereka adalah array
    const imageFile = Array.isArray(files.imageFile) ? files.imageFile[0] : files.imageFile;

    if (!imageFile || !imageFile.filepath) {
      console.error("Missing or invalid image file:", imageFile);
      return res.status(400).json({ message: "Image file is required and must be valid" });
    }

    // Upload metadata ke Solana (Pinata)
    console.log("Uploading metadata to Pinata...");
    const metadataUri = await uploadMetadata({
      tokenName: tokenName as string,
      symbol: symbol as string,
      description: description as string,
      imageFile: fs.createReadStream(imageFile.filepath),
    });
    console.log("Metadata uploaded to Pinata:", metadataUri);

    // Hapus file sementara setelah diunggah
    fs.unlink(imageFile.filepath, (err) => {
      if (err) console.error("Error deleting temporary file:", err);
    });

    // Respond dengan metadata URI
    return res.status(200).json({ metadataUri });
  } catch (error: any) {
    console.error("Error in upload-metadata handler:", error);
    return res.status(500).json({ message: error.message || "Internal Server Error" });
  }
}
