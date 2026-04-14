// src/app/page.js

import Navbar    from '../components/Navbar';
import Hero      from '../components/Hero';
import Intro     from '../components/Intro';
import Features  from '../components/Features';
import Ethereum  from '../components/Ethereum';
import Quote     from '../components/Quote';
import Mission   from '../components/Mission';
import Lifecycle from '../components/Lifecycle';
import Footer    from '../components/Footer';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />

      <div style={{ padding: '0 var(--page-px)' }}>
        <div className="section-rule" />
      </div>

      <Intro />

      <div style={{ padding: '0 var(--page-px)' }}>
        <div className="section-rule" />
      </div>

      <Features />
      <Ethereum />
      <Quote />
      <Mission />

      <div style={{ padding: '0 var(--page-px)' }}>
        <div className="section-rule" />
      </div>

      <Lifecycle />
      <Footer />
    </main>
  );
}