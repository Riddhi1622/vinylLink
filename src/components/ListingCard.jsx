'use client';

// src/components/ListingCard.jsx

import { useState, useRef } from 'react';
import { toEther } from 'thirdweb/utils';
import { addToWishlist, removeFromWishlist } from '../lib/db';

export default function ListingCard({
  listing,
  metadata,
  walletAddress,
  isWishlisted,
  onWishlistToggle,
}) {
  const [playing, setPlaying] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const audioRef = useRef(null);

  const priceEth = listing?.pricePerToken
    ? parseFloat(toEther(listing.pricePerToken)).toFixed(4)
    : '—';

  const name = metadata?.name ?? `Token #${listing.tokenId.toString()}`;
  const image = resolveIpfs(metadata?.image);
  const audioSrc = resolveIpfs(
    metadata?.animation_url ?? metadata?.audio ?? metadata?.audio_url
  );

  function toggleAudio() {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  }

  async function toggleWishlist() {
    if (!walletAddress) return; // wallet not connected — button is disabled
    if (wishlistLoading) return;

    setWishlistLoading(true);
    try {
      if (isWishlisted) {
        await removeFromWishlist(walletAddress, listing.id);
        onWishlistToggle(listing.id, false);
      } else {
        await addToWishlist(walletAddress, listing.id);
        onWishlistToggle(listing.id, true);
      }
    } catch (err) {
      console.error('Wishlist toggle error:', err);
    } finally {
      setWishlistLoading(false);
    }
  }

  return (
    <article className="listing-card">
      {/* Album Art */}
      <div className="listing-card__art">
        {image ? (
          <img src={image} alt={name} className="listing-card__img" />
        ) : (
          <div className="listing-card__img-placeholder">
            <VinylPlaceholder />
          </div>
        )}

        {/* Audio play/pause overlay */}
        {audioSrc && (
          <>
            <button
              className={`listing-card__play ${playing ? 'listing-card__play--active' : ''}`}
              onClick={toggleAudio}
              aria-label={playing ? `Pause ${name}` : `Play ${name}`}
            >
              {playing ? <PauseIcon /> : <PlayIcon />}
            </button>
            <audio ref={audioRef} src={audioSrc} onEnded={() => setPlaying(false)} />
          </>
        )}

        {/* Wishlist button */}
        <button
          className={`listing-card__wishlist ${isWishlisted ? 'listing-card__wishlist--saved' : ''} ${wishlistLoading ? 'listing-card__wishlist--loading' : ''}`}
          onClick={toggleWishlist}
          disabled={!walletAddress || wishlistLoading}
          title={
            !walletAddress
              ? 'Connect wallet to save'
              : isWishlisted
              ? 'Remove from saved'
              : 'Save record'
          }
          aria-label={isWishlisted ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
        >
          <HeartIcon filled={isWishlisted} />
        </button>
      </div>

      {/* Info */}
      <div className="listing-card__info">
        <h3 className="listing-card__name">{name}</h3>

        <div className="listing-card__meta">
          <span className="listing-card__label">Price</span>
          <span className="listing-card__price">
            <EthIcon />
            {priceEth} ETH
          </span>
        </div>

        <div className="listing-card__meta">
          <span className="listing-card__label">Token ID</span>
          <span className="listing-card__token-id">#{listing.tokenId.toString()}</span>
        </div>
      </div>
    </article>
  );
}

/* ── helpers ─────────────────────────────────────────────────────────────── */

function resolveIpfs(uri) {
  if (!uri) return null;
  if (uri.startsWith('ipfs://')) {
    return uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
  }
  return uri;
}

/* ── inline SVGs ─────────────────────────────────────────────────────────── */

function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <polygon points="5,3 19,12 5,21" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  );
}

function HeartIcon({ filled }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function EthIcon() {
  return (
    <svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor"
      aria-hidden="true" style={{ marginRight: '4px', opacity: 0.7 }}>
      <path d="M5 0L0 8.16L5 11.02L10 8.16L5 0Z" opacity="0.6" />
      <path d="M5 12.04L0 9.18L5 16L10 9.18L5 12.04Z" />
      <path d="M5 0L0 8.16L5 5.84V0Z" opacity="0.45" />
    </svg>
  );
}

function VinylPlaceholder() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <circle cx="40" cy="40" r="38" fill="#1c1a16" stroke="#2e2a22" strokeWidth="2" />
      <circle cx="40" cy="40" r="16" fill="#121008" />
      <circle cx="40" cy="40" r="5" fill="#07070a" />
      {[22, 26, 30].map((r, i) => (
        <circle key={i} cx="40" cy="40" r={r} fill="none" stroke="#232018" strokeWidth="0.8" opacity="0.5" />
      ))}
    </svg>
  );
}