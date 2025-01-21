// src/wallet.tsx
import React, { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

// Import gaya CSS untuk wallet modal
import '@solana/wallet-adapter-react-ui/styles.css';

interface WalletContextProps {
  children: React.ReactNode;
}

export const WalletContextProvider: React.FC<WalletContextProps> = ({ children }) => {
  const network = 'mainnet-beta'; // Ganti dengan 'mainnet-beta' jika diperlukan
  const endpoint = clusterApiUrl(network);

  const wallets = useMemo(
    () => [
      new SolflareWalletAdapter(),
      // Tambahkan adaptor wallet lain jika diperlukan
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
