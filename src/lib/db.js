// src/lib/db.js
// All Supabase query functions — import these wherever you need DB access.

import { supabase } from './supabase';

/* ── Users ──────────────────────────────────────────────────────────────────
   Called once when a wallet connects. Creates the user row if it doesn't
   exist yet (upsert), and returns the user record.
   wallet_address is always stored lowercase.
────────────────────────────────────────────────────────────────────────── */
export async function upsertUser(walletAddress) {
  const address = walletAddress.toLowerCase();
  const { data, error } = await supabase
    .from('users')
    .upsert({ wallet_address: address }, { onConflict: 'wallet_address' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/* ── Listing Metadata Cache ─────────────────────────────────────────────────
   Before fetching from IPFS, check if we already have the metadata stored.
   After a successful IPFS fetch, write it to the cache.
────────────────────────────────────────────────────────────────────────── */

/**
 * Returns cached metadata for a given assetContract + tokenId, or null.
 */
export async function getCachedMetadata(assetContract, tokenId) {
  const { data, error } = await supabase
    .from('listing_metadata_cache')
    .select('metadata')
    .eq('asset_contract', assetContract.toLowerCase())
    .eq('token_id', tokenId.toString())
    .maybeSingle();

  if (error) {
    console.warn('Cache read error:', error.message);
    return null;
  }
  return data?.metadata ?? null;
}

/**
 * Writes resolved NFT metadata to the cache.
 * Uses upsert so re-running never creates duplicates.
 */
export async function setCachedMetadata(assetContract, tokenId, metadata) {
  const { error } = await supabase
    .from('listing_metadata_cache')
    .upsert(
      {
        asset_contract: assetContract.toLowerCase(),
        token_id: tokenId.toString(),
        metadata,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'asset_contract,token_id' }
    );

  if (error) console.warn('Cache write error:', error.message);
}

/* ── Wishlists ──────────────────────────────────────────────────────────────
   Each row ties a wallet_address to a listing_id (from the marketplace).
────────────────────────────────────────────────────────────────────────── */

/**
 * Returns a Set of listing IDs (as strings) that the user has wishlisted.
 */
export async function getWishlist(walletAddress) {
  const { data, error } = await supabase
    .from('wishlists')
    .select('listing_id')
    .eq('wallet_address', walletAddress.toLowerCase());

  if (error) throw error;
  return new Set((data ?? []).map((r) => r.listing_id.toString()));
}

/**
 * Adds a listing to the user's wishlist.
 */
export async function addToWishlist(walletAddress, listingId) {
  const { error } = await supabase.from('wishlists').upsert(
    {
      wallet_address: walletAddress.toLowerCase(),
      listing_id: listingId.toString(),
    },
    { onConflict: 'wallet_address,listing_id' }
  );
  if (error) throw error;
}

/**
 * Removes a listing from the user's wishlist.
 */
export async function removeFromWishlist(walletAddress, listingId) {
  const { error } = await supabase
    .from('wishlists')
    .delete()
    .eq('wallet_address', walletAddress.toLowerCase())
    .eq('listing_id', listingId.toString());
  if (error) throw error;
}