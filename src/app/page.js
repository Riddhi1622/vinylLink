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
      <div>
        /test-db 
        (for testing database connection)
        /tokens (for testing the indexing of tokens)
        /api/indexer/tokens (for connecting ethereum to supabase)

         curl -X POST http://localhost:3000/api/indexer/sync \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer "service role key goes here"
  for vs code termianl backup api checking                                                                  

      </div>

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