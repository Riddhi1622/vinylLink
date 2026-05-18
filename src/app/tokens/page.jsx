export default async function TestTokensPage() {
  const res = await fetch('http://localhost:3000/api/indexer/tokens', {
    cache: 'no-store',
  });
  const data = await res.json();

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
        <h1>1 of 2 apis worked!</h1>
      <h2> Tokens in Supabase ({data.count})</h2>
      <pre style={{ background: '#111', color: '#0f0', padding: '1rem', borderRadius: '8px', overflow: 'auto' }}>
        {JSON.stringify(data.tokens, null, 2)}
      </pre>
    </div>
  );
}