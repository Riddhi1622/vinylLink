// scripts/sync-tokens.mjs
// Run: node scripts/sync-tokens.mjs

import { createThirdwebClient, getContract } from 'thirdweb';
import { ethereum } from 'thirdweb/chains';
import { getNFT, totalSupply } from 'thirdweb/extensions/erc721';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '../.env.local' });

const NFT_CONTRACT   = '0xeC272De2AdDeb0D828BdC21482863a3410B540e3';

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY  // ← service role needed for writes
);

function resolveIpfs(uri) {
  if (!uri) return null;
  if (uri.startsWith('ipfs://')) return 'https://ipfs.io/ipfs/' + uri.slice(7);
  return uri;
}

// Traits are in attributes array: [{ trait_type: 'albumTitle', value: 'In Between Dreams' }]
function parseTraits(attributes = []) {
  const map = {};
  for (const attr of attributes) {
    if (attr.trait_type) map[attr.trait_type] = attr.value;
  }
  return map;
}

async function sync() {
  const contract = getContract({ client, chain: ethereum, address: NFT_CONTRACT });

  const supply = await totalSupply({ contract });
  const total = Number(supply);
  console.log(`Found ${total} tokens on ${NFT_CONTRACT}`);

  for (let i = 0; i < total; i++) {
    try {
      const nft = await getNFT({ contract, tokenId: BigInt(i), includeOwner: true });
      const meta = nft?.metadata ?? {};
      const t = parseTraits(meta.attributes ?? []);

      console.log(`\nToken ${i} raw traits:`, t); // so you can verify mapping

      const row = {
        contract_id:       NFT_CONTRACT.toLowerCase(),
        token_id:          i,
        owner_address:     nft?.owner?.toLowerCase() ?? null,

        // Mapped from attributes traits
        item_type:         t['itemType']         ?? 'Record Album',
        album_title:       t['albumTitle']        ?? meta.name ?? null,
        artist:            t['artist']            ?? null,
        release_year:      t['releaseYear']       ? parseInt(t['releaseYear']) : null,
        genre:             t['genre']             ?? null,
        subgenre:          t['subgenre']          ?? null,
        label:             t['label']             ?? null,
        catalog_number:    t['catalogNumber']     ?? null,
        format:            t['format']            ?? null,
        speed_rpm:         t['speedRPM']          ? parseInt(t['speedRPM']) : null,
        disc_count:        t['discCount']         ? parseInt(t['discCount']) : null,
        vinyl_color:       t['vinylColor']        ?? null,
        edition_label:     t['editionLabel']      ?? null,
        pressing_region:   t['pressingRegion']    ?? null,
        sleeve_condition:  t['sleeveCondition']   ?? null,
        vinyl_condition:   t['vinylCondition']    ?? null,
        era_tag:           t['eraTag']            ?? null,
        track_highlight:   t['trackHighlight']    ?? null,
        album_description: t['albumDescription']  ?? meta.description ?? null,
        album_pricing:     t['albumPricing']      ?? null,
        album_notes:       t['albumNotes']        ?? null,

        // Media
        image_url:         resolveIpfs(meta.image)         ?? null,
        animation_url:     resolveIpfs(meta.animation_url) ?? null,

        // Defaults
        is_sold:           false,
        is_hidden:         false,
        vault_status:      'vaulted',
        deployed_at:       new Date().toISOString(),

        // Raw catch-all
        metadata:          meta,
      };

      const { error } = await supabase
        .from('tokens')
        .upsert(row, { onConflict: 'contract_id,token_id' });

      if (error) {
        console.error(`✗ Token ${i} DB error:`, error.message);
      } else {
        console.log(`✓ Token ${i} — ${row.artist ?? '?'} – ${row.album_title ?? '?'}`);
      }

    } catch (err) {
      console.warn(`✗ Token ${i} fetch failed:`, err.message);
    }
  }

  console.log('\nSync complete.');
}

sync();