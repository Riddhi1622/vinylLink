// src/app/components/Hero.js
import VinylRecord from './VinylRecord';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg-glow" />

      <div className="hero-inner">
        {/* Left — Text */}
        <div className="hero-text">
          <div className="hero-eyebrow">Blockchain Provenance</div>

          <h1 className="hero-title">
            Own.<br />
            Vault.<br />
            <em>Trade.</em>
          </h1>

          <p className="hero-subtitle">
            A trusted, blockchain-powered way to own, vault, and trade
            vintage records. Every token secures a real physical album,
            recorded on-chain.
          </p>

          <div className="hero-cta-row">
            <a href="#intro" className="hero-cta">
              Discover the Platform
              <span className="hero-cta-arrow">→</span>
            </a>
          </div>
        </div>

        {/* Right — Spinning Vinyl */}
        <div className="hero-vinyl-wrap">
          <div className="vinyl-rotating">
            <VinylRecord size={440} />
          </div>
        </div>
      </div>
    </section>
  );
}