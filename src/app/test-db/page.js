// export default function TestDBPage() {
//   return <div>
//     Database api. check vscode console for more
//     </div>;
// }

'use client';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';

export default function TestDB() {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetch() {
      try {
        const { data, error } = await supabaseBrowser.from('tokens').select('*');
        if (error) throw error;
        setTokens(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace', background: '#0a0a0a', minHeight: '100vh', color: 'white' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Database Connection Test</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>❌ Error: {error}</p>}
      {!loading && !error && (
        <>
          <p style={{ color: 'lightgreen' }}>✅ Connected! Found {tokens.length} tokens</p>
          <pre style={{ marginTop: '1rem', background: '#111', padding: '1rem', borderRadius: '8px', overflow: 'auto', fontSize: '12px' }}>
            {JSON.stringify(tokens, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
}
