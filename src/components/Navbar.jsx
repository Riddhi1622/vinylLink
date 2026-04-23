// ConnectButton is kept isolated in its own <div> — never inside a <button>.
// The hydration error comes from thirdweb rendering nested <button> elements
// inside its modal; wrapping in a div prevents that conflict. do not touch it at any cost

'use client';
import { ConnectButton } from 'thirdweb/react';
import { client } from '../lib/thirdweb-client';
import { ethereum } from 'thirdweb/chains';

export default function Navbar() {
  return (
    <nav className="nav">
      {/* Logo */}
      <a href="/" className="nav-logo">
        <div className="nav-logo-mark" />
        <span className="nav-logo-text">VinylLINK</span>
      </a>

      {/* Right side */}
      <div className="nav-right">
        <span className="nav-tagline">Own · Vault · Trade</span>

        <a href="/marketplace" className="nav-cta">Marketplace</a>

        {/* ConnectButton must live in a plain <div>, never inside a <button> */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ConnectButton
            client={client}
            chain={ethereum}
            theme="dark"
            connectButton={{
              label: 'Connect Wallet',
              style: {
                fontFamily: 'var(--font-sans)',
                fontSize: '10px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                background: 'transparent',
                border: '1px solid var(--gold-border)',
                borderRadius: '1px',
                padding: '8px 18px',
                cursor: 'pointer',
                height: 'auto',
              },
            }}
            detailsButton={{
              style: {
                fontFamily: 'var(--font-sans)',
                fontSize: '10px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                background: 'transparent',
                border: '1px solid var(--gold-border)',
                borderRadius: '1px',
                padding: '8px 18px',
                cursor: 'pointer',
                height: 'auto',
              },
            }}
          />
        </div>
      </div>
    </nav>
  );
}