'use client';

// src/app/components/Navbar.js
import { useState, useCallback } from 'react';

export default function Navbar() {
  const [walletState, setWalletState] = useState('idle'); // idle | connecting | connected | error
  const [address, setAddress] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const shortAddress = address
    ? `${address.slice(0, 6)}…${address.slice(-4)}`
    : null;

  const connectWallet = useCallback(async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('No Ethereum wallet detected. Please install MetaMask.');
      return;
    }

    try {
      setWalletState('connecting');
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      setAddress(accounts[0]);
      setWalletState('connected');

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          setAddress(null);
          setWalletState('idle');
        } else {
          setAddress(accounts[0]);
        }
      });
    } catch (err) {
      console.error('Wallet connection error:', err);
      setWalletState('error');
      setTimeout(() => setWalletState('idle'), 2000);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setWalletState('idle');
    setShowDropdown(false);
  }, []);

  return (
    <nav className="nav">
      {/* Logo */}
      <a href="#" className="nav-logo">
        <div className="nav-logo-mark" />
        <span className="nav-logo-text">VinylLINK</span>
      </a>

      {/* Right side */}
      <div className="nav-right">
        <span className="nav-tagline">Own · Vault · Trade</span>

        {/* Connect Wallet Button */}
        {walletState === 'connected' ? (
          <div className="wallet-connected-wrap">
            <button
              className="wallet-btn wallet-btn--connected"
              onClick={() => setShowDropdown((v) => !v)}
              aria-expanded={showDropdown}
              aria-haspopup="true"
            >
              <span className="wallet-dot" />
              <span className="wallet-address">{shortAddress}</span>
              <WalletChevron />
            </button>

            {showDropdown && (
              <div className="wallet-dropdown">
                <button
                  className="wallet-dropdown-item"
                  onClick={() => {
                    navigator.clipboard.writeText(address);
                    setShowDropdown(false);
                  }}
                >
                  <CopyIcon />
                  Copy Address
                </button>
                <div className="wallet-dropdown-divider" />
                <button
                  className="wallet-dropdown-item wallet-dropdown-item--danger"
                  onClick={disconnect}
                >
                  <DisconnectIcon />
                  Disconnect
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            className={`wallet-btn ${walletState === 'connecting' ? 'wallet-btn--loading' : ''} ${walletState === 'error' ? 'wallet-btn--error' : ''}`}
            onClick={connectWallet}
            disabled={walletState === 'connecting'}
            aria-busy={walletState === 'connecting'}
          >
            <WalletIcon />
            <span>
              {walletState === 'connecting'
                ? 'Connecting…'
                : walletState === 'error'
                ? 'Try Again'
                : 'Connect Wallet'}
            </span>
          </button>
        )}
      </div>
    </nav>
  );
}

/* ── Inline SVG Icons ─────────────────────────────────────────────────────── */

function WalletIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z" />
      <circle cx="16" cy="14" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function WalletChevron() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function DisconnectIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}