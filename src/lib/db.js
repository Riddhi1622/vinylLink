
import { supabaseBrowser } from './supabase-browser';

export async function getMarketplaceTokens() {
  const { data, error } = await supabaseBrowser
    .from('tokens')
    .select('*')
    .order('token_id', { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getWishlist(walletAddress) {
  const { data, error } = await supabaseBrowser
    .from('wishlists')
    .select('listing_id')
    .eq('wallet_address', walletAddress);

  if (error) return new Set();
  return new Set(data.map(r => r.listing_id?.toString()));
}

export async function addToWishlist(walletAddress, listingId) {
  await supabaseBrowser.from('wishlists').insert({
    wallet_address: walletAddress,
    listing_id: listingId.toString(),
  });
}

export async function removeFromWishlist(walletAddress, listingId) {
  await supabaseBrowser.from('wishlists')
    .delete()
    .eq('wallet_address', walletAddress)
    .eq('listing_id', listingId.toString());
}

export async function upsertUser(walletAddress) {
  await supabaseBrowser.from('users').upsert(
    { wallet_address: walletAddress },
    { onConflict: 'wallet_address' }
  );
}

export async function getCachedMetadata(contractAddress, tokenId) {
  const { data } = await supabaseBrowser
    .from('tokens')
    .select('raw_metadata')
    .eq('contract_address', contractAddress.toLowerCase())
    .eq('token_id', tokenId.toString())
    .single();
  return data?.raw_metadata ?? null;
}

export async function setCachedMetadata(contractAddress, tokenId, metadata) {
  await supabaseBrowser.from('tokens').update({ raw_metadata: metadata })
    .eq('contract_address', contractAddress.toLowerCase())
    .eq('token_id', tokenId.toString());
}
EOF