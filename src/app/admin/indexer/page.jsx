'use client';

import { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

// ── Helpers ────────────────────────────────────────────────────────────────

function resolveIpfs(uri) {
  if (!uri) return null;
  if (uri.startsWith('ipfs://')) return 'https://ipfs.io/ipfs/' + uri.slice(7);
  return uri;
}

const CONDITION_COLOR = {
  'M':   '#a8d8a8',
  'NM':  '#a8d8a8',
  'EX':  '#c8e6c9',
  'VG+': '#c9a256',
  'VG':  '#b8860b',
  'G+':  '#cd853f',
  'G':   '#a0522d',
  'P':   '#e05050',
};

// ── Token Card ─────────────────────────────────────────────────────────────

function TokenCard({ token }) {
  const [expanded, setExpanded] = useState(false);
  const image = resolveIpfs(token.image_uri);
  const name = token.album_title ?? `Token #${token.token_id}`;
  const conditionColor = CONDITION_COLOR[token.vinyl_condition] ?? 'var(--cream-25)';

  return (
    <article style={{
      background: 'var(--surface-02)',
      border: '1px solid var(--border-cream)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'border-color 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--gold-border)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-cream)'}
    >
      {/* Token ID badge */}
      <div style={{
        position: 'absolute', top: '12px', left: '12px', zIndex: 2,
        background: 'rgba(8,8,11,0.85)', border: '1px solid var(--border-cream)',
        padding: '3px 8px', backdropFilter: 'blur(4px)',
      }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '9px', letterSpacing: '0.15em', color: 'var(--cream-50)', textTransform: 'uppercase' }}>
          #{token.token_id}
        </span>
      </div>

      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '1/1', background: 'var(--surface-01)', overflow: 'hidden' }}>
        {image ? (
          <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <VinylSVG />
          </div>
        )}

        {/* Condition badge on image */}
        {token.vinyl_condition && (
          <div style={{
            position: 'absolute', bottom: '10px', right: '10px',
            background: 'rgba(8,8,11,0.85)', border: `1px solid ${conditionColor}`,
            padding: '3px 8px', backdropFilter: 'blur(4px)',
          }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '9px', letterSpacing: '0.12em', color: conditionColor, textTransform: 'uppercase' }}>
              {token.vinyl_condition}
            </span>
          </div>
        )}
      </div>

      {/* Main info */}
      <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>

        {/* Title */}
        <h3 style={{
          fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontWeight: 400,
          color: 'var(--cream)', margin: 0, lineHeight: 1.2,
        }}>{name}</h3>

        {/* Artist */}
        {token.primary_artist && (
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--gold)', margin: 0, letterSpacing: '0.05em' }}>
            {token.primary_artist}
          </p>
        )}

        {/* Key fields row */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
          {token.release_year && <Tag label={token.release_year} />}
          {token.genre && <Tag label={token.genre} />}
          {token.album_format && <Tag label={token.album_format} />}
          {token.pressing_region && <Tag label={token.pressing_region} />}
        </div>

        {/* Label + catalog */}
        {(token.label || token.catalog_number) && (
          <Row
            left={token.label ?? '—'}
            right={token.catalog_number ? `Cat. ${token.catalog_number}` : null}
          />
        )}

        {/* Conditions */}
        {(token.sleeve_condition || token.vinyl_condition) && (
          <Row
            left={token.sleeve_condition ? `Sleeve: ${token.sleeve_condition}` : null}
            right={token.vinyl_condition ? `Vinyl: ${token.vinyl_condition}` : null}
          />
        )}

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(v => !v)}
          style={{
            marginTop: '8px',
            background: 'none',
            border: '1px solid var(--border-cream)',
            color: 'var(--cream-50)',
            fontFamily: 'var(--font-sans)',
            fontSize: '9px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            padding: '6px 12px',
            cursor: 'pointer',
            transition: 'border-color 0.2s, color 0.2s',
            alignSelf: 'flex-start',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold-border)'; e.currentTarget.style.color = 'var(--gold)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-cream)'; e.currentTarget.style.color = 'var(--cream-50)'; }}
        >
          {expanded ? 'Less ↑' : 'More ↓'}
        </button>

        {/* Expanded details */}
        {expanded && (
          <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid var(--border-cream)', paddingTop: '12px' }}>
            {token.era_tag && <ExpandRow label="Era" value={token.era_tag} />}
            {token.subgenre && <ExpandRow label="Subgenre" value={token.subgenre} />}
            {token.vinyl_color && <ExpandRow label="Vinyl Color" value={token.vinyl_color} />}
            {token.edition_label && <ExpandRow label="Edition" value={token.edition_label} />}
            {token.barcode && <ExpandRow label="Barcode" value={token.barcode} />}
            {token.matrix_runout && <ExpandRow label="Matrix" value={token.matrix_runout} />}
            {token.disc_count && <ExpandRow label="Discs" value={token.disc_count} />}
            {token.speed_rpm && <ExpandRow label="Speed" value={`${token.speed_rpm} RPM`} />}

            {/* Boolean flags */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
              {token.is_gatefold && <Flag label="Gatefold" />}
              {token.is_sealed && <Flag label="Sealed" />}
              {token.is_double_lp && <Flag label="Double LP" />}
              {token.is_picture_disc && <Flag label="Picture Disc" />}
              {token.is_promo_copy && <Flag label="Promo" />}
              {token.includes_insert && <Flag label="Insert" />}
              {token.includes_original_inner_sleeve && <Flag label="Inner Sleeve" />}
            </div>

            {token.track_highlight && (
              <div style={{ marginTop: '6px' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '9px', letterSpacing: '0.14em', color: 'var(--cream-25)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Tracks</span>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--cream-50)', margin: 0, lineHeight: 1.6 }}>{token.track_highlight}</p>
              </div>
            )}

            {token.album_description && (
              <div style={{ marginTop: '6px' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '9px', letterSpacing: '0.14em', color: 'var(--cream-25)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Description</span>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--cream-50)', margin: 0, lineHeight: 1.7 }}>{token.album_description}</p>
              </div>
            )}

            {/* Owner + minted */}
            <div style={{ borderTop: '1px solid var(--border-cream)', paddingTop: '10px', marginTop: '4px' }}>
              {token.owner_address && (
                <ExpandRow label="Owner" value={`${token.owner_address.slice(0, 6)}...${token.owner_address.slice(-4)}`} />
              )}
              {token.minted_at && (
                <ExpandRow label="Minted" value={new Date(token.minted_at).toLocaleDateString()} />
              )}
              <ExpandRow label="Recorded" value={new Date(token.created_at).toLocaleDateString()} />
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

// ── Small sub-components ───────────────────────────────────────────────────

function Tag({ label }) {
  return (
    <span style={{
      fontFamily: 'var(--font-sans)', fontSize: '9px', letterSpacing: '0.12em',
      textTransform: 'uppercase', color: 'var(--cream-50)',
      border: '1px solid var(--border-cream)', padding: '2px 7px',
    }}>{label}</span>
  );
}

function Flag({ label }) {
  return (
    <span style={{
      fontFamily: 'var(--font-sans)', fontSize: '9px', letterSpacing: '0.12em',
      textTransform: 'uppercase', color: 'var(--gold)',
      border: '1px solid var(--gold-border)', padding: '2px 7px',
    }}>{label}</span>
  );
}

function Row({ left, right }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      {left && <span style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', color: 'var(--cream-50)' }}>{left}</span>}
      {right && <span style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', color: 'var(--cream-25)' }}>{right}</span>}
    </div>
  );
}

function ExpandRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--cream-25)', flexShrink: 0 }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', color: 'var(--cream-50)', textAlign: 'right' }}>{String(value)}</span>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function AdminIndexerPage() {
  const [tokens, setTokens] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [status, setStatus] = useState('loading');
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [filterGenre, setFilterGenre] = useState('');
  const [filterEra, setFilterEra] = useState('');
  const [filterFormat, setFilterFormat] = useState('');
  const [filterCondition, setFilterCondition] = useState('');

  async function loadTokens() {
    try {
      const res = await fetch('/api/indexer/tokens');
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Failed to load');
      const data = json.tokens ?? [];
      setTokens(data);
      setFiltered(data);
      setStatus(data.length === 0 ? 'empty' : 'ready');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  }

  useEffect(() => { loadTokens(); }, []);

  // Apply filters whenever tokens or filter values change
  useEffect(() => {
    let result = [...tokens];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(t =>
        (t.album_title ?? '').toLowerCase().includes(q) ||
        (t.primary_artist ?? '').toLowerCase().includes(q) ||
        (t.label ?? '').toLowerCase().includes(q) ||
        (t.token_id ?? '').toString().includes(q)
      );
    }

    if (filterGenre)     result = result.filter(t => t.genre === filterGenre);
    if (filterEra)       result = result.filter(t => t.era_tag === filterEra);
    if (filterFormat)    result = result.filter(t => t.album_format === filterFormat);
    if (filterCondition) result = result.filter(t => t.vinyl_condition === filterCondition);

    setFiltered(result);
  }, [tokens, search, filterGenre, filterEra, filterFormat, filterCondition]);

  async function handleSync() {
    setSyncing(true);
    setSyncMsg(null);
    try {
      const res = await fetch('/api/indexer/sync', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Sync failed');
      setSyncMsg(`✓ Synced — ${json.tokens_found} found, ${json.tokens_added} added`);
      await loadTokens();
    } catch (err) {
      setSyncMsg(`✗ ${err.message}`);
    } finally {
      setSyncing(false);
    }
  }

  // Get unique filter options from actual data
  const genres     = [...new Set(tokens.map(t => t.genre).filter(Boolean))];
  const eras       = [...new Set(tokens.map(t => t.era_tag).filter(Boolean))];
  const formats    = [...new Set(tokens.map(t => t.album_format).filter(Boolean))];
  const conditions = [...new Set(tokens.map(t => t.vinyl_condition).filter(Boolean))];

  return (
    <main style={{ minHeight: '100vh', background: 'var(--surface-00)', color: 'var(--cream)' }}>
      <Navbar />

      {/* Header */}
      <section style={{ paddingTop: '120px', paddingBottom: '40px', paddingLeft: 'var(--page-px)', paddingRight: 'var(--page-px)' }}>
        <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto' }}>

          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '16px' }}>
            Admin · Indexer
          </p>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', marginBottom: '40px' }}>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, fontStyle: 'italic', color: 'var(--cream)', margin: 0, lineHeight: 1 }}>
              Token Registry
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              {syncMsg && (
                <span style={{
                  fontFamily: 'var(--font-sans)', fontSize: '11px',
                  color: syncMsg.startsWith('✓') ? '#a8d8a8' : '#e05050',
                  letterSpacing: '0.05em',
                }}>
                  {syncMsg}
                </span>
              )}
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--cream-25)', letterSpacing: '0.08em' }}>
                {filtered.length} / {tokens.length} tokens
              </span>
              <button
                onClick={handleSync}
                disabled={syncing}
                style={{
                  fontFamily: 'var(--font-sans)', fontSize: '10px', letterSpacing: '0.18em',
                  textTransform: 'uppercase', color: syncing ? 'var(--cream-25)' : 'var(--gold)',
                  background: 'transparent', border: '1px solid var(--gold-border)',
                  padding: '8px 20px', cursor: syncing ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => { if (!syncing) e.currentTarget.style.background = 'var(--gold-ghost)'; }}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {syncing ? 'Syncing…' : 'Sync Now'}
              </button>
            </div>
          </div>

          {/* Rule */}
          <div className="section-rule" />

          {/* Filters */}
          <div style={{ marginTop: '28px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Search */}
            <input
              type="text"
              placeholder="Search title, artist, label…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.05em',
                background: 'var(--surface-03)', border: '1px solid var(--border-cream)',
                color: 'var(--cream)', padding: '8px 14px', outline: 'none',
                width: '220px',
              }}
            />

            <FilterSelect label="Genre"     value={filterGenre}     onChange={setFilterGenre}     options={genres} />
            <FilterSelect label="Era"       value={filterEra}       onChange={setFilterEra}       options={eras} />
            <FilterSelect label="Format"    value={filterFormat}    onChange={setFilterFormat}    options={formats} />
            <FilterSelect label="Condition" value={filterCondition} onChange={setFilterCondition} options={conditions} />

            {/* Clear filters */}
            {(search || filterGenre || filterEra || filterFormat || filterCondition) && (
              <button
                onClick={() => { setSearch(''); setFilterGenre(''); setFilterEra(''); setFilterFormat(''); setFilterCondition(''); }}
                style={{
                  fontFamily: 'var(--font-sans)', fontSize: '9px', letterSpacing: '0.15em',
                  textTransform: 'uppercase', color: 'var(--cream-50)',
                  background: 'none', border: '1px solid var(--border-cream)',
                  padding: '8px 14px', cursor: 'pointer',
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>
    {/* Grid */}
      <section style={{ padding: '20px var(--page-px) 100px' }}>
        <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto' }}>

          {status === 'loading' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '80px 0', color: 'var(--cream-50)', fontFamily: 'var(--font-sans)', fontSize: '12px', letterSpacing: '0.1em' }}>
              <SpinnerSVG />
              <span>Loading registry…</span>
            </div>
          )}

          {status === 'error' && (
            <div style={{ padding: '80px 0', color: '#e05050', fontFamily: 'var(--font-sans)', fontSize: '13px' }}>
              Failed to load tokens. Check console for details.
            </div>
          )}

          {status === 'empty' && (
            <div style={{ padding: '80px 0', color: 'var(--cream-25)', fontFamily: 'var(--font-sans)', fontSize: '12px', letterSpacing: '0.1em' }}>
              No tokens in registry. Hit "Sync Now" to pull from the blockchain.
            </div>
          )}

          {filtered.length === 0 && status === 'ready' && (
            <div style={{ padding: '60px 0', color: 'var(--cream-25)', fontFamily: 'var(--font-sans)', fontSize: '12px', letterSpacing: '0.1em' }}>
              No tokens match your filters.
            </div>
          )}

          {status === 'ready' && filtered.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px',
            }}>
              {filtered.map(token => (
                <TokenCard key={`${token.token_id}-${token.contract_address}`} token={token} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

// ── SVG helpers ────────────────────────────────────────────────────────────

function FilterSelect({ label, value, onChange, options }) {
  if (options.length === 0) return null;
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.05em',
        background: 'var(--surface-03)', border: '1px solid var(--border-cream)',
        color: value ? 'var(--cream)' : 'var(--cream-25)',
        padding: '8px 14px', outline: 'none', cursor: 'pointer',
      }}
    >
      <option value="">{label}: All</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function VinylSVG() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="38" fill="#1c1b17" stroke="#2e2a22" strokeWidth="1.5" />
      {[22, 27, 32].map((r, i) => (
        <circle key={i} cx="40" cy="40" r={r} fill="none" stroke="#232018" strokeWidth="0.7" opacity="0.5" />
      ))}
      <circle cx="40" cy="40" r="10" fill="#121008" />
      <circle cx="40" cy="40" r="4" fill="#07070a" />
      <circle cx="40" cy="40" r="1.5" fill="var(--gold)" opacity="0.4" />
    </svg>
  );
}

function SpinnerSVG() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      style={{ animation: 'vinyl-spin 1s linear infinite', opacity: 0.5 }}>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}