'use client';

// src/app/marketplace/page.jsx

import { useEffect, useState } from 'react';
import { getContract } from 'thirdweb';
import { ethereum } from 'thirdweb/chains';
import { getAllValidListings } from 'thirdweb/extensions/marketplace';
import { getNFT } from 'thirdweb/extensions/erc721';
import { useActiveAccount } from 'thirdweb/react';
import { client } from '../../lib/thirdweb-client';
import { getCachedMetadata, setCachedMetadata, getWishlist, upsertUser } from '../../lib/db';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const MARKETPLACE_ADDRESS = '0xE9F6abfEEc1F701eA7e03F18C104F38ac299773b';

function resolveIpfs(uri) {
  if (!uri) return null;
  if (uri.startsWith('ipfs://')) return 'https://ipfs.io/ipfs/' + uri.slice(7);
  return uri;
}

function toEthDisplay(pricePerToken) {
  if (!pricePerToken && pricePerToken !== 0n) return '—';
  try {
    const eth = Number(BigInt(pricePerToken)) / 1e18;
    return eth.toFixed(4);
  } catch {
    return '—';
  }
}

// ── ListingCard ────────────────────────────────────────────────────────────
function ListingCard({ listing, metadata, walletAddress, isWishlisted, onWishlistToggle }) {
  const [playing, setPlaying] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const audioRef = useState(null);

  const tokenId = listing.tokenId?.toString() ?? listing.id?.toString() ?? '?';
  const name = metadata?.name ?? `Token #${tokenId}`;
  const image = resolveIpfs(metadata?.image);
  const audioSrc = resolveIpfs(metadata?.animation_url ?? metadata?.audio ?? metadata?.audio_url);
  const priceEth = toEthDisplay(listing.pricePerToken);

  function toggleAudio() {
    const el = audioRef[0];
    if (!el) return;
    if (playing) { el.pause(); setPlaying(false); }
    else { el.play(); setPlaying(true); }
  }

  async function toggleWishlist() {
    if (!walletAddress || wishlistLoading) return;
    setWishlistLoading(true);
    try {
      const { addToWishlist, removeFromWishlist } = await import('../../lib/db');
      if (isWishlisted) {
        await removeFromWishlist(walletAddress, listing.id);
        onWishlistToggle(listing.id, false);
      } else {
        await addToWishlist(walletAddress, listing.id);
        onWishlistToggle(listing.id, true);
      }
    } catch (err) {
      console.error('Wishlist error:', err);
    } finally {
      setWishlistLoading(false);
    }
  }

  return (
    <article style={{
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
      {/* Art */}
      <div style={{ position: 'relative', aspectRatio: '1/1', background: 'var(--surface-01)', overflow: 'hidden' }}>
        {image ? (
          <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <VinylSVG />
          </div>
        )}

        {/* Audio button */}
        {audioSrc && (
          <>
            <button
              onClick={toggleAudio}
              style={{
                position: 'absolute', bottom: '10px', right: '10px',
                width: '38px', height: '38px', borderRadius: '50%',
                background: 'rgba(8,8,11,0.82)', border: '1px solid var(--gold-border)',
                color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', backdropFilter: 'blur(4px)',
              }}
              aria-label={playing ? 'Pause' : 'Play'}
            >
              {playing ? <PauseIcon /> : <PlayIcon />}
            </button>
            <audio
              ref={el => { audioRef[0] = el; }}
              src={audioSrc}
              onEnded={() => setPlaying(false)}
            />
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
        <h3 style={{
          fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 400,
          color: 'var(--cream)', margin: 0,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{name}</h3>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--cream-25)' }}>Price</span>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.88rem', fontWeight: 600, color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <EthIcon /> {priceEth} ETH
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--cream-25)' }}>Token ID</span>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: 'var(--cream-50)' }}>#{tokenId}</span>
        </div>
      </div>
    </article>
  );
}

// ── MarketplacePage ────────────────────────────────────────────────────────
export default function MarketplacePage() {
  const account = useActiveAccount();
  const walletAddress = account?.address ?? null;

  const [listings, setListings] = useState([]);
  const [metadataMap, setMetadataMap] = useState({});
  const [wishlist, setWishlist] = useState(new Set());
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    async function load() {
      try {
        const marketplace = getContract({ client, chain: ethereum, address: MARKETPLACE_ADDRESS });

        const allListings = await getAllValidListings({
          contract: marketplace,
          start: 0,
          count: BigInt(100),
        });

        // Log first listing so we can see exact field names in console
        if (allListings?.length > 0) {
          console.log('[VinylLINK] First listing raw object:', allListings[0]);
        }

        if (!allListings || allListings.length === 0) { setStatus('empty'); return; }

        setListings(allListings);
        setStatus('ready');

        await Promise.all(allListings.map(async (listing) => {
          // thirdweb v5 uses assetContractAddress
          const contractAddr = listing.assetContractAddress ?? listing.assetContract;
          const tokenId = listing.tokenId;
          const key = `${contractAddr}_${tokenId}`;

          // 1. Try Supabase cache
          try {
            const cached = await getCachedMetadata(contractAddr, tokenId);
            if (cached) { setMetadataMap(prev => ({ ...prev, [key]: cached })); return; }
          } catch (_) {}

          // 2. Fetch from IPFS via thirdweb
          try {
            const nftContract = getContract({ client, chain: ethereum, address: contractAddr });
            const nft = await getNFT({ contract: nftContract, tokenId });
            console.log('[VinylLINK] NFT metadata for', tokenId.toString(), ':', nft?.metadata);
            const meta = nft?.metadata ?? null;
            setMetadataMap(prev => ({ ...prev, [key]: meta }));
            if (meta) await setCachedMetadata(contractAddr, tokenId, meta).catch(() => {});
          } catch (err) {
            console.warn('[VinylLINK] Metadata fetch failed for token', tokenId?.toString(), err.message);
            setMetadataMap(prev => ({ ...prev, [key]: null }));
          }
        }));
      } catch (err) {
        console.error('[VinylLINK] Marketplace load error:', err);
        setStatus('error');
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (!walletAddress) { setWishlist(new Set()); return; }
    async function syncUser() {
      try {
        await upsertUser(walletAddress);
        const saved = await getWishlist(walletAddress);
        setWishlist(saved);
      } catch (err) { console.warn('User sync error:', err); }
    }
    syncUser();
  }, [walletAddress]);

  function handleWishlistToggle(listingId, isNowSaved) {
    setWishlist(prev => {
      const next = new Set(prev);
      isNowSaved ? next.add(listingId.toString()) : next.delete(listingId.toString());
      return next;
    });
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--surface-00)', color: 'var(--cream)' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ paddingTop: '140px', paddingBottom: '60px', paddingLeft: 'var(--page-px)', paddingRight: 'var(--page-px)', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '20px' }}>
          On-Chain Vinyl
        </p>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 300, fontStyle: 'italic', color: 'var(--cream)', marginBottom: '20px', lineHeight: 1 }}>
          The Vault
        </h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--cream-50)', maxWidth: '460px', margin: '0 auto', lineHeight: 1.8 }}>
          Every record is tokenised, vaulted, and tradeable. Connect your wallet to own one.
        </p>
      </section>

      {/* Rule */}
      <div style={{ padding: '0 var(--page-px)' }}>
        <div className="section-rule" />
      </div>

      {/* Grid */}
      <section style={{ padding: '60px var(--page-px) 100px' }}>
        {status === 'loading' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '80px 0', color: 'var(--cream-50)', fontFamily: 'var(--font-sans)', fontSize: '13px', letterSpacing: '0.1em' }}>
            <SpinnerSVG />
            <p>Loading listings from the blockchain…</p>
          </div>
        )}

        {status === 'error' && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#e05050', fontFamily: 'var(--font-sans)', fontSize: '13px' }}>
            Failed to load listings. Check console for details.
          </div>
        )}

        {status === 'empty' && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--cream-25)', fontFamily: 'var(--font-sans)', fontSize: '13px', letterSpacing: '0.1em' }}>
            No active listings at the moment.
          </div>
        )}

        {status === 'ready' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '24px',
            maxWidth: 'var(--max-width)',
            margin: '0 auto',
          }}>
            {listings.map((listing) => {
              const contractAddr = listing.assetContractAddress ?? listing.assetContract;
              const key = `${contractAddr}_${listing.tokenId}`;
              return (
                <ListingCard
                  key={listing.id.toString()}
                  listing={listing}
                  metadata={metadataMap[key] ?? null}
                  walletAddress={walletAddress}
                  isWishlisted={wishlist.has(listing.id.toString())}
                  onWishlistToggle={handleWishlistToggle}
                />
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}

// ── SVG helpers ────────────────────────────────────────────────────────────

function VinylSVG() {
  return (
    <svg width="90" height="90" viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="38" fill="#1c1b17" stroke="#2e2a22" strokeWidth="1.5" />
      {[22, 27, 32].map((r, i) => <circle key={i} cx="40" cy="40" r={r} fill="none" stroke="#232018" strokeWidth="0.7" opacity="0.5" />)}
      <circle cx="40" cy="40" r="10" fill="#121008" />
      <circle cx="40" cy="40" r="4" fill="#07070a" />
      <circle cx="40" cy="40" r="1.5" fill="var(--gold)" opacity="0.4" />
    </svg>
  );
}

function SpinnerSVG() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animation: 'vinyl-spin 1s linear infinite', opacity: 0.4 }}>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

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