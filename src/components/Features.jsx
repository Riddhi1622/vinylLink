// src/app/components/Features.js

const FEATURES = [
  {
    number: '01 / Provenance',
    title: 'Provenance',
    text: 'Every record album is professionally cleaned and condition-graded, with ownership and provenance immutably recorded on-chain. No guesswork, no uncertainty—just transparent, permanent digital trust.',
  },
  {
    number: '02 / Ownership',
    title: 'Tokenized Ownership',
    text: 'Physical vinyl becomes a legally secure, tradable, blockchain-backed asset—instantly transferable, permanently verifiable, and ready for the future.',
  },
  {
    number: '03 / Custody',
    title: 'Vault-Grade Custody',
    text: 'Records may be condition-graded and held in secure, climate-controlled vaults for preservation, or safely returned at any time. Every path maintains verified ownership, condition integrity, and provenance continuity.',
  },
];

export default function Features() {
  return (
    <section className="section features">
      <div className="section-inner">
        <div className="features-header">
          <span className="features-label">Core Features</span>
          <h2 className="features-title">Three Pillars of Trust</h2>
        </div>

        {/* Desktop: 3-column grid | Mobile: horizontal swipe carousel */}
        <div className="features-grid">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.number} {...feature} />
          ))}
        </div>

        {/* Mobile swipe indicator dots */}
        <div className="features-dots" aria-hidden="true">
          <span className="features-dot" />
          <span className="features-dot" />
          <span className="features-dot" />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ number, title, text }) {
  return (
    <article className="feature-card">
      <div className="feature-number">{number}</div>
      <div className="feature-body">
        <div className="feature-mark" />
        <h3 className="feature-title">{title}</h3>
        <p className="feature-text">{text}</p>
      </div>
    </article>
  );
}