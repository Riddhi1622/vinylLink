// src/app/components/Lifecycle.js

const SIDE_A = [
  {
    number: 'A1',
    title: 'Market Entry',
    desc: 'Each record enters the VinylLINK system when it becomes part of the global collector market.',
  },
  {
    number: 'A2',
    title: 'Clean & Grade',
    desc: 'Professionally cleaned and condition-graded, establishing a verified baseline of physical integrity.',
  },
  {
    number: 'A3',
    title: 'Minted On-Chain',
    desc: 'A permanent digital layer of ownership, provenance, and condition history is created on the Ethereum blockchain.',
  },
];

const SIDE_B = [
  {
    number: 'B1',
    title: 'Vault Custody',
    desc: 'Optionally stored in secure, climate-controlled vault custody to preserve its graded state indefinitely.',
  },
  {
    number: 'B2',
    title: 'Digital Transfer',
    desc: 'Ownership transfers digitally through the token, while the physical asset remains preserved or held privately.',
  },
  {
    number: 'B3',
    title: 'Release or Return',
    desc: 'At any time, the owner can initiate a vault transfer or physical release—complete flexibility across the full lifecycle of the record.',
  },
];

export default function Lifecycle() {
  return (
    <section id="lifecycle" className="section lifecycle">
      <div className="section-inner">
        <div className="lifecycle-header">
          <div className="lifecycle-label">How It Works</div>
          <h2 className="lifecycle-title">The Record Lifecycle</h2>
        </div>

        <div className="tracklist">
          <TracklistSide label="Side A — Entry & Provenance" tracks={SIDE_A} />
          <TracklistSide label="Side B — Custody & Transfer" tracks={SIDE_B} />
        </div>
      </div>
    </section>
  );
}

function TracklistSide({ label, tracks }) {
  return (
    <div className="tracklist-side">
      <div className="tracklist-side-header">
        <span className="tracklist-side-label">{label}</span>
        <span className="tracklist-side-tag">{tracks.length} Tracks</span>
      </div>
      {tracks.map((track) => (
        <Track key={track.number} {...track} />
      ))}
    </div>
  );
}

function Track({ number, title, desc }) {
  return (
    <div className="track">
      <span className="track-number">{number}</span>
      <div className="track-content">
        <div className="track-title">{title}</div>
        <p className="track-desc">{desc}</p>
      </div>
    </div>
  );
}