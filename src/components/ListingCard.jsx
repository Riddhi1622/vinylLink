'use client';

// src/components/ListingCard.jsx

import { useState, useRef } from 'react';
import { addToWishlist, removeFromWishlist } from '../lib/db';

export default function ListingCard({
  token,
  walletAddress,
  isWishlisted,
  onWishlistToggle,
}) {
  const [playing, setPlaying] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const audioRef = useRef(null);

  const name = token.artist && token.album_title
    ? `${token.artist} – ${token.album_title}`
    : token.album_title ?? `Token #${token.token_id}`;

  const image = token.image_url ?? null;
  const audioSrc = token.animation_url ?? null;
  const priceEth = token.price ? parseFloat(token.price).toFixed(4) : '—';

  function toggleAudio() {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.play(); setPlaying(true); }
  }

  async function toggleWishlist() {
    if (!walletAddress || wishlistLoading) return;
    setWishlistLoading(true);
    try {
      if (isWishlisted) {
        await removeFromWishlist(walletAddress, token.id);
        onWishlistToggle(token.id, false);
      } else {
        await addToWishlist(walletAddress, token.id);
        onWishlistToggle(token.id, true);
      }
    } catch (err) {
      console.error('Wishlist toggle error:', err);
    } finally {
      setWishlistLoading(false);
    }
  }

  return (
    <article
      style={{
        background: 'var(--surface-02)',
        border: '1px solid var(--border-cream)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.35s ease, border-color 0.35s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.borderColor = 'var(--gold-border)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border-cream)'; }}
    >
      {/* Album Art */}
      <div style={{ position: 'relative', aspectRatio: '1/1', background: 'var(--surface-01)', overflow: 'hidden' }}>
        {image ? (
          <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <VinylPlaceholder />
          </div>
        )}

        {/* Audio button */}
        {audioSrc && (
          <>
            <button onClick={toggleAudio} aria-label={playing ? 'Pause' : 'Play'} style={{
              position: 'absolute', bottom: '10px', right: '10px',
              width: '38px', height: '38px', borderRadius: '50%',
              background: 'rgba(8,8,11,0.82)', border: '1px solid var(--gold-border)',
              color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', backdropFilter: 'blur(4px)',
            }}>
              {playing ? <PauseIcon /> : <PlayIcon />}
            </button>
            <audio ref={audioRef} src={audioSrc} onEnded={() => setPlaying(false)} />
          </>
        )}

        {/* Wishlist button */}
        <button
          onClick={toggleWishlist}
          disabled={!walletAddress || wishlistLoading}
          title={!walletAddress ? 'Connect wallet to save' : isWishlisted ? 'Remove from saved' : 'Save record'}
          style={{
            position: 'absolute', top: '10px', right: '10px',
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'rgba(8,8,11,0.75)',
            border: isWishlisted ? '1px solid rgba(220,80,80,0.6)' : '1px solid var(--border-cream)',
            color: isWishlisted ? '#e05050' : 'var(--cream-50)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: walletAddress ? 'pointer' : 'not-allowed',
            opacity: walletAddress ? 1 : 0.4,
            backdropFilter: 'blur(4px)',
            transition: 'all 0.2s',
          }}
        >
          <HeartIcon filled={isWishlisted} />
        </button>
      </div>

      {/* Info */}
      <div style={{ padding: '18px 20px 22px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

        {/* Title */}
        <h3 style={{
          fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontWeight: 400,
          color: 'var(--cream)', margin: 0,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{name}</h3>

        {/* Genre / Year */}
        {(token.genre || token.release_year) && (
          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: '11px',
            color: 'var(--cream-25)', margin: 0,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {[token.genre, token.release_year].filter(Boolean).join(' · ')}
          </p>
        )}

        {/* Condition badges */}
        {(token.vinyl_condition || token.sleeve_condition) && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {token.vinyl_condition && (
              <span style={{
                fontFamily: 'var(--font-sans)', fontSize: '9px', letterSpacing: '0.12em',
                textTransform: 'uppercase', color: 'var(--gold)',
                border: '1px solid var(--gold-border)', padding: '2px 7px',
              }}>
                Vinyl {token.vinyl_condition}
              </span>
            )}
            {token.sleeve_condition && (
              <span style={{
                fontFamily: 'var(--font-sans)', fontSize: '9px', letterSpacing: '0.12em',
                textTransform: 'uppercase', color: 'var(--cream-50)',
                border: '1px solid var(--border-cream)', padding: '2px 7px',
              }}>
                Sleeve {token.sleeve_condition}
              </span>
            )}
          </div>
        )}

        {/* Pressing region + format */}
        {(token.pressing_region || token.format) && (
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', color: 'var(--cream-25)', margin: 0 }}>
            {[token.pressing_region, token.format].filter(Boolean).join(' · ')}
          </p>
        )}

        <div style={{ borderTop: '1px solid var(--border-cream)', paddingTop: '10px', marginTop: '2px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {/* Price */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--cream-25)' }}>Price</span>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.88rem', fontWeight: 600, color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <EthIcon /> {priceEth} {token.currency ?? 'ETH'}
            </span>
          </div>

          {/* Token ID */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--cream-25)' }}>Token</span>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: 'var(--cream-50)' }}>#{token.token_id}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ── SVGs ─────────────────────────────────────────────────────────────────── */

function PlayIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>;
}
function PauseIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>;
}
function HeartIcon({ filled }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
function EthIcon() {
  return (
    <svg width="9" height="14" viewBox="0 0 10 16" fill="currentColor" style={{ opacity: 0.7 }}>
      <path d="M5 0L0 8.16L5 11.02L10 8.16L5 0Z" opacity="0.6" />
      <path d="M5 12.04L0 9.18L5 16L10 9.18L5 12.04Z" />
    </svg>
  );
}
function VinylPlaceholder() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="38" fill="#1c1a16" stroke="#2e2a22" strokeWidth="2" />
      <circle cx="40" cy="40" r="16" fill="#121008" />
      <circle cx="40" cy="40" r="5" fill="#07070a" />
      {[22, 26, 30].map((r, i) => (
        <circle key={i} cx="40" cy="40" r={r} fill="none" stroke="#232018" strokeWidth="0.8" opacity="0.5" />
      ))}
    </svg>
  );
}