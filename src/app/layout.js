// src/app/layout.js
import { Cormorant_Garamond, Syne } from 'next/font/google';
import './globals.css';

/*
 *  Cormorant Garamond — archival serif for headings
 *  Heritage feel, editorial weight, italic richness
 */
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

/*
 *  Syne — geometric sans-serif for UI & body copy
 *  Slightly unusual, clean, avoids the generic look
 */
const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
});

export const metadata = {
  title: 'VinylLINK — Own. Vault. Trade.',
  description:
    'A trusted, blockchain-powered way to own, vault, and trade vintage records. Every token secures a real physical record album, with its ownership, provenance, and sound recorded on-chain.',
  keywords: [
    'vinyl records',
    'blockchain',
    'NFT',
    'Ethereum',
    'record collecting',
    'provenance',
    'vault custody',
  ],
  openGraph: {
    title: 'VinylLINK — Own. Vault. Trade.',
    description:
      'A trusted, blockchain-powered way to own, vault, and trade vintage records.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${syne.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}