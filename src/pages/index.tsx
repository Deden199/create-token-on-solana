import React from "react";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { WalletContextProvider } from '../contexts/wallet';
import dynamic from "next/dynamic";
import ParticleBackground from '@/components/ParticleBackground';

// Developer Tools Component
import CreateToken from "@/components/CreateToken";
const WalletMultiButton = dynamic(
  () => import("@solana/wallet-adapter-react-ui").then((mod) => mod.WalletMultiButton),
  { ssr: false } // Disable SSR
);

export default function HomePage() {
  return (
    <WalletContextProvider>
      <>
        <ParticleBackground />

        {/* SEO TAGS */}
        <Head>
          {/* Google Site Verification */}
          <meta name="google-site-verification" content="Sc3skyzNLhxTCKMDl4Eb2Txa8G3QiR6jbs3dGfycQ-M" />

          {/* Updated Title */}
          <title>Solradian - Blockchain Revolution</title>

          {/* Updated Meta Description */}
          <meta
            name="description"
            content="Solradian offers a practical blockchain solution for managing SPL tokens on Solana."
          />

          {/* Updated Meta Keywords */}
          <meta
            name="keywords"
            content="Solana, SPL Token, Blockchain, Solradian, Developer Tools, Token Creation"
          />

          {/* Canonical URL */}
          <link rel="canonical" href="https://solradian.com" />

          {/* Open Graph Tags */}
          <meta property="og:title" content="Solradian - Blockchain Revolution" />
          <meta
            property="og:description"
            content="Solradian offers a practical blockchain solution for managing SPL tokens on Solana."
          />
          <meta property="og:url" content="https://solradian.com" />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="https://solradian.com/solradian.webp" />

          {/* Twitter Card Tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Solradian - Blockchain Revolution" />
          <meta
            name="twitter:description"
            content="Solradian offers a practical blockchain solution for managing SPL tokens on Solana."
          />
          <meta name="twitter:image" content="https://solradian.com/images/solradian.webp" />

          {/* Structured Data (JSON-LD) */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                "url": "https://solradian.com",
                "name": "Solradian",
                "description":
                  "Solradian offers a practical blockchain solution for managing SPL tokens on Solana.",
                "publisher": {
                  "@type": "Organization",
                  "name": "Solradian",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://solradian.com/images/logo.png",
                  },
                },
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://solradian.com/search?q={search_term_string}",
                  "query-input": "required name=search_term_string",
                },
              }),
            }}
          />
        </Head>

        {/* Header */}
        <header className="flex justify-between items-center px-6 py-4 bg-gray-900 shadow-md sticky top-0 z-50 animate-fade">
          <h1 className="text-2xl font-bold text-pink-500 drop-shadow-lg">Solradian</h1>
          <WalletMultiButton className="ghost-button phantom-connect-btn" />
        </header>

        {/* Hero Section */}
        <section className="text-center py-12 bg-gradient-to-b from-gray-900 to-gray-800 animate-fade">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 md:mb-6 text-pink-500 drop-shadow-xl">
            Manage Your Tokens with Ease
          </h2>
          <p className="max-w-xl text-base md:text-lg mx-auto leading-relaxed mb-6 md:mb-8 text-gray-300">
            Solradian provides a practical blockchain solution to help you manage your SPL tokens on Solana.
          </p>
          <a
            href="https://pump.fun/coin/9oj7fxjBZ1pXe1WAYgTzJV59HFy13Ux4bKW3oDnQpump"
            className="px-5 md:px-6 py-2 md:py-3 bg-pink-500 text-sm md:text-lg font-semibold text-white rounded-md shadow-lg btn-glow hover:bg-pink-600 transition"
          >
            Buy SLR
          </a>
        </section>

        {/* Developer Tools */}
        <CreateToken />

        {/* Key Features */}
        <section className="py-16 animate-fade key-features-section">
          <h3 className="text-4xl font-extrabold text-center text-pink-500 mb-12">
            Key Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
            <div className="feature-item">
              <h4 className="text-2xl font-semibold text-pink-500 mb-3">
                Ultra-Low Fees
              </h4>
              <p className="text-gray-300">
                Experience minimal transaction costs on Solana.
              </p>
            </div>
            <div className="feature-item">
              <h4 className="text-2xl font-semibold text-pink-500 mb-3">
                Lightning Speed
              </h4>
              <p className="text-gray-300">
                Complete transactions in seconds.
              </p>
            </div>
            <div className="feature-item">
              <h4 className="text-2xl font-semibold text-pink-500 mb-3">
                Seamless Integration
              </h4>
              <p className="text-gray-300">
                Easily add your tokens to liquidity pools.
              </p>
            </div>
            <div className="feature-item">
              <h4 className="text-2xl font-semibold text-pink-500 mb-3">
                Scalability
              </h4>
              <p className="text-gray-300">
                Support for thousands of transactions per second.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 bg-gray-900 text-center animate-fade">
          <div className="flex justify-center space-x-6 mb-6">
            <a
              href="https://x.com/solradianz"
              target="_blank"
              rel="noreferrer"
              className="text-pink-500 hover:text-pink-600 transition"
              aria-label="Twitter"
            >
              Twitter
            </a>
            <a
              href="https://t.me/solradiantool"
              target="_blank"
              rel="noreferrer"
              className="text-pink-500 hover:text-pink-600 transition"
              aria-label="Telegram"
            >
              Telegram
            </a>
          </div>
          <p className="text-sm text-gray-400">
            © 2025 Solradian. All rights reserved.
          </p>
        </footer>

        {/* Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </>
    </WalletContextProvider>
  );
}
