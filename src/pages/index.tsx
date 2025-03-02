// pages/index.tsx
import React from "react";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { WalletContextProvider } from "../contexts/wallet";
import dynamic from "next/dynamic";

// Komponen DeveloperTools
import CreateToken from "@/components/CreateToken";

// WalletMultiButton perlu dynamic import untuk mencegah error SSR
const WalletMultiButton = dynamic(
  () => import("@solana/wallet-adapter-react-ui").then((mod) => mod.WalletMultiButton),
  { ssr: false }
);

export default function HomePage() {
  return (
    <WalletContextProvider>
      <>
        {/* SEO TAGS */}
        <Head>
          <meta name="google-site-verification" content="Sc3skyzNLhxTCKMDl4Eb2Txa8G3QiR6jbs3dGfycQ-M" />
          <title>Solradian - Cartoon Style Token Creation</title>
          <meta
            name="description"
            content="Create your SPL token on Solana with a fun, cartoon-inspired interface. Solradian makes it easy to launch and manage tokens with minimal fees."
          />
          <meta
            name="keywords"
            content="Solana, SPL Token, Cartoon Style, Solradian, Token Creation, DeFi, dApps, blockchain"
          />
          <link rel="canonical" href="https://solradian.com" />
          <meta property="og:title" content="Solradian - Cartoon Style Token Creation" />
          <meta
            property="og:description"
            content="Bring some color and fun to your token creation process on Solana. Explore Solradian's bright, cartoon-inspired tools for an easy blockchain experience."
          />
          <meta property="og:url" content="https://solradian.com" />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="https://solradian.com/solradian.webp" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Solradian - Cartoon Style Token Creation" />
          <meta
            name="twitter:description"
            content="Brighten your blockchain journey with Solradian's cartoonish design and easy token creation on Solana."
          />
          <meta name="twitter:image" content="https://solradian.com/images/solradian.webp" />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                "url": "https://solradian.com",
                "name": "Solradian",
                "description":
                  "Explore the fun side of blockchain with Solradian's cartoon-inspired interface. Build and manage your SPL tokens on Solana easily.",
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
        <header className="flex justify-between items-center px-6 py-4 bg-pink-200 sticky top-0 z-50 animate-fade shadow-lg">
          <h1 className="text-2xl font-bold text-blue-600 drop-shadow-md">Solradian</h1>
          <WalletMultiButton className="ghost-button phantom-connect-btn" />
        </header>

        {/* Hero Section */}
        <section className="text-center py-12 bg-gradient-to-b from-yellow-50 to-pink-50 animate-fade">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 md:mb-6 text-blue-600 drop-shadow-md">
            Create Your Token in a Colorful World
          </h2>
          <p className="max-w-xl text-base md:text-lg mx-auto leading-relaxed mb-6 md:mb-8 text-gray-700">
            Experience a fun, cartoon-inspired interface while creating your own SPL token on Solana. 
            Simple, intuitive, and ready for the next big idea!
          </p>
          <a
            href="https://app.binance.com/uni-qr/cart/19329812857921?isst=1&l=en&r=86987631&uc=web_square_share_link&uco=iBxCMe2QYRNVBYGvj3RgbA&us=copylink"
            className="px-5 md:px-6 py-2 md:py-3 bg-blue-500 text-sm md:text-lg font-semibold text-white rounded-md shadow-md hover:bg-blue-600 transition btn-glow"
          >
            Learn More
          </a>
        </section>

        {/* Developer Tools / Create Token */}
        <CreateToken />

        {/* Key Features */}
        <section className="py-16 animate-fade key-features-section bg-pink-50">
          <h3 className="text-4xl font-extrabold text-center text-blue-600 mb-12">
            Key Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
            <div className="feature-item">
              <h4 className="text-2xl font-semibold text-blue-600 mb-3">
                Low Fees
              </h4>
              <p className="text-gray-700">
                Enjoy minimal transaction costs on the Solana network.
              </p>
            </div>
            <div className="feature-item">
              <h4 className="text-2xl font-semibold text-blue-600 mb-3">
                High Speed
              </h4>
              <p className="text-gray-700">
                Process your token transactions in just seconds.
              </p>
            </div>
            <div className="feature-item">
              <h4 className="text-2xl font-semibold text-blue-600 mb-3">
                Seamless Integration
              </h4>
              <p className="text-gray-700">
                Quickly add your tokens to pools with minimal extra steps.
              </p>
            </div>
            <div className="feature-item">
              <h4 className="text-2xl font-semibold text-blue-600 mb-3">
                Scalability
              </h4>
              <p className="text-gray-700">
                Handle thousands of transactions per second on Solana.
              </p>
            </div>
          </div>
        </section>

        {/* Roadmap & Future Vision */}
        <section className="py-16 bg-yellow-50 animate-fade">
          <div className="max-w-4xl mx-auto px-6">
            <h3 className="text-4xl font-extrabold text-center text-blue-600 mb-8">
              Roadmap & Future Vision
            </h3>
            <p className="text-gray-700 text-lg mb-6">
              Solradian aims to bring the joy of creation into the blockchain space with a playful twist.
              Here’s a glimpse of our roadmap for the upcoming milestones:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-3">
              <li>
                <strong>Q2 2025:</strong> Beta launch of our cheerful developer suite with an improved cartoon UI/UX.
              </li>
              <li>
                <strong>Q3 2025:</strong> Cross-chain functionality and advanced analytics integration.
              </li>
              <li>
                <strong>Q4 2025:</strong> Official launch of the Solradian Marketplace for token trading, plus NFT collaborations.
              </li>
              <li>
                <strong>2026 & Beyond:</strong> Continuous feature upgrades, community-driven improvements, and strategic partnerships.
              </li>
            </ul>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 bg-pink-200 text-center animate-fade">
          <div className="flex justify-center space-x-6 mb-6">
            <a
              href="https://x.com/solradianz"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:text-blue-800 transition"
              aria-label="Twitter"
            >
              Twitter
            </a>
            <a
              href="https://t.me/solradiantool"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:text-blue-800 transition"
              aria-label="Telegram"
            >
              Telegram
            </a>
          </div>
          <p className="text-sm text-gray-700">
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
