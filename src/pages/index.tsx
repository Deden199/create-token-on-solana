// pages/index.tsx
import React from "react";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { WalletContextProvider } from '../contexts/wallet';
import dynamic from "next/dynamic";
import ParticleBackground from '@/components/ParticleBackground';

// Komponen DeveloperTools
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

          {/* Title of the main page */}
          <title>Create Token on Solana - Solradian.com</title>

          {/* Meta Description (important for SEO) */}
          <meta
            name="description"
            content="Create your own token on Solana with Solradian's Developer Tools. Experience the lowest fees and seamless integration into the pool."
          />

          {/* Meta Keywords (less impactful for modern SEO) */}
          <meta
            name="keywords"
            content="Solana Token Creator, Create Token on Solana, SPL Token, Solradian, Low Fees, Fast Transactions, Tokenization, DeFi, dApps, blockchain"
          />

          {/* Canonical URL */}
          <link rel="canonical" href="https://solradian.com" />

          {/* Open Graph Tags */}
          <meta property="og:title" content="Create Token on Solana - Solradian.com" />
          <meta
            property="og:description"
            content="Empower your blockchain projects with Solradian's Developer Tools. Easily create tokens on Solana with low fees and fast transactions."
          />
          <meta property="og:url" content="https://solradian.com" />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="https://solradian.com/solradian.webp" />

          {/* Twitter Card Tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Create Token on Solana - Solradian.com" />
          <meta
            name="twitter:description"
            content="Empower your blockchain projects with Solradian's Developer Tools. Easily create tokens on Solana with low fees and fast transactions."
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
                  "Explore the future of blockchain with Solradian. Built on Solana, we deliver efficiency, scalability, and advanced tokenization solutions globally.",
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
        <header className="flex justify-between items-center px-6 py-4 bg-gray-800 shadow-md sticky top-0 z-50 animate-fade">
          <h1 className="text-2xl font-bold text-cyan-400">Solradian</h1>
          <WalletMultiButton className="ghost-button phantom-connect-btn" />
        </header>

        {/* Section Hero */}
        
        <section className="text-center py-12 bg-gradient-to-b from-gray-900 to-gray-800 animate-fade">
  <h2 className="text-4xl md:text-5xl font-extrabold mb-4 md:mb-6">
    Create Token On Solana
  </h2>
  <p className="max-w-xl text-base md:text-lg mx-auto leading-relaxed mb-6 md:mb-8 text-gray-300">
    Create your own SPL token with Solradian. Our tools are sufficient for your primary needs, allowing you to add directly to the pool without unnecessary extras.
  </p>
  <a
    href="#features"
    className="px-5 md:px-6 py-2 md:py-3 bg-cyan-500 text-sm md:text-lg font-semibold text-white rounded-md shadow-md btn-glow hover:bg-cyan-600 transition"
  >
    Learn More
  </a>
</section>


        {/* Komponen DeveloperTools */}
        <CreateToken />

        {/* Key Features */}
        <section className="py-16 animate-fade key-features-section">
          <h3 className="text-4xl font-extrabold text-center text-cyan-400 mb-12">
            Key Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
            <div className="feature-item">
              <h4 className="text-2xl font-semibold text-cyan-400 mb-3">
                Low Fees
              </h4>
              <p className="text-gray-300">
                Benefit from Solana's minimal transaction costs.
              </p>
            </div>
            <div className="feature-item">
              <h4 className="text-2xl font-semibold text-cyan-400 mb-3">
                High Speed
              </h4>
              <p className="text-gray-300">Process transactions in just seconds.</p>
            </div>
            <div className="feature-item">
              <h4 className="text-2xl font-semibold text-cyan-400 mb-3">
                Seamless Integration
              </h4>
              <p className="text-gray-300">
                Easily add your tokens to the pool without extra steps.
              </p>
            </div>
            <div className="feature-item">
              <h4 className="text-2xl font-semibold text-cyan-400 mb-3">
                Scalability
              </h4>
              <p className="text-gray-300">
                Support thousands of transactions per second.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 bg-gray-800 text-center animate-fade">
          <div className="flex justify-center space-x-6 mb-6">
            {/* <a
              href="https://twitter.com/solradian"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:text-cyan-600 transition"
              aria-label="Twitter"
            >
              Twitter
            </a> */}
            <a
              href="https://t.me/solradian"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:text-cyan-600 transition"
              aria-label="Telegram"
            >
              Telegram
            </a>
            {/* <a
              href="https://solradian.com"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:text-cyan-600 transition"
              aria-label="Website"
            >
              Website
            </a> */}
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