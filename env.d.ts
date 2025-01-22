// env.d.ts

declare namespace NodeJS {
    interface ProcessEnv {
      PINATA_API_KEY: string;
      PINATA_SECRET_API_KEY: string;
      SOLANA_RPC_URL: string;
      // Tambahkan variabel lain jika diperlukan
    }
  }
  