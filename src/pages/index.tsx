// pages/index.tsx
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

          {/* New Title */}
          <title>Solradian - Cyberpunk Blockchain Revolution</title>

          {/* Updated Meta Description */}
          <meta
            name="description"
            content="Enter the cyberpunk universe of Solradian: Where futuristic blockchain innovation meets edgy comic aesthetics. Create your own SPL token on Solana with cutting-edge developer tools."
          />

          {/* Meta Keywords */}
          <meta
            name="keywords"
            content="Cyberpunk, Solana, SPL Token, Blockchain, Solradian, Developer Tools, Token Creation, Future, Roadmap"
          />

          {/* Canonical URL */}
          <link rel="canonical" href="https://solradian.com" />

          {/* Open Graph Tags */}
          <meta property="og:title" content="Solradian - Cyberpunk Blockchain Revolution" />
          <meta
            property="og:description"
            content="Enter the cyberpunk universe of Solradian. Create and launch your own SPL token on Solana with our advanced developer tools and futuristic design."
          />
          <meta property="og:url" content="https://solradian.com" />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="https://solradian.com/solradian.webp" />

          {/* Twitter Card Tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Solradian - Cyberpunk Blockchain Revolution" />
          <meta
            name="twitter:description"
            content="Step into the future with Solradian's cyberpunk aesthetic and blockchain innovation. Create your SPL token on Solana with ease and style."
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
                  "Enter the cyberpunk universe of Solradian. Explore futuristic blockchain innovation and create your own SPL token on Solana.",
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
            Unleash Your Token in a Cyberpunk Universe
          </h2>
          <p className="max-w-xl text-base md:text-lg mx-auto leading-relaxed mb-6 md:mb-8 text-gray-300">
            Dive into the edgy world of Solradian. Create your own SPL token on Solana with our futuristic, developer-centric tools—designed for the next generation of blockchain projects.
          </p>
          <a
            href="https://app.binance.com/uni-qr/cart/19329812857921?isst=1&l=en&r=86987631&uc=web_square_share_link&uco=iBxCMe2QYRNVBYGvj3RgbA&us=copylink"
            className="px-5 md:px-6 py-2 md:py-3 bg-pink-500 text-sm md:text-lg font-semibold text-white rounded-md shadow-lg btn-glow hover:bg-pink-600 transition"
          >
            Learn More
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
              <p className="text-gray-300">Complete transactions in mere seconds.</p>
            </div>
            <div className="feature-item">
              <h4 className="text-2xl font-semibold text-pink-500 mb-3">
                Seamless Integration
              </h4>
              <p className="text-gray-300">
                Instantly add your tokens to liquidity pools without hassle.
              </p>
            </div>
            <div className="feature-item">
              <h4 className="text-2xl font-semibold text-pink-500 mb-3">
                Scalability
              </h4>
              <p className="text-gray-300">
                Support thousands of transactions per second.
              </p>
            </div>
          </div>
        </section>

        {/* Roadmap & Future Vision */}
        <section className="py-16 bg-gray-800 animate-fade">
          <div className="max-w-4xl mx-auto px-6">
            <h3 className="text-4xl font-extrabold text-center text-pink-500 mb-8">
              Roadmap & Future Vision
            </h3>
            <p className="text-gray-300 text-lg mb-6">
              Solradian is on a relentless mission to revolutionize blockchain creation with a cyberpunk twist. Our roadmap outlines the strategic phases designed to empower developers and expand our ecosystem.
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-3">
              <li>
                <strong>Q2 2025:</strong> Beta launch of the full developer suite and enhanced UI/UX with comic-style visuals.
              </li>
              <li>
                <strong>Q3 2025:</strong> Integration of advanced analytics and cross-chain functionality.
              </li>
              <li>
                <strong>Q4 2025:</strong> Public release of Solradian Marketplace for token trading and NFT collaborations.
              </li>
              <li>
                <strong>2026 and Beyond:</strong> Continuous upgrades, community-driven features, and strategic partnerships to further cement our position in the blockchain revolution.
              </li>
            </ul>
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
