// src/app/components/Quote.js

export default function Quote() {
  return (
    <section className="section quote">
      <div className="section-inner">
        <div className="quote-inner">
          <div className="quote-liner-label">Liner Notes — Co-Founder</div>

          <span className="quote-mark" aria-hidden="true">"</span>

          <blockquote className="quote-text">
            I co-founded VinylLINK because the world needed a new kind of
            records truth engine—one that doesn't just tokenize vinyl, but
            preserves condition, provenance, and cultural memory, while making
            ownership verifiable and transferable for the first time.
          </blockquote>

          <div className="quote-attribution">
            <div className="quote-author-mark" aria-hidden="true" />
            <div>
              <div className="quote-author-name">John Bortolotti</div>
              <div className="quote-author-role">Co-Founder, VinylLINK</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}