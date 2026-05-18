// import { NextResponse } from 'next/server';
// import { getContract } from 'thirdweb';
// import { getNFTs } from 'thirdweb/extensions/erc721';
// import { ethereum } from 'thirdweb/chains';
// import { client } from '@/lib/thirdweb-client';
// import { supabaseServer } from '@/lib/supabase-server';

// const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

// function parseAttributes(attributes = []) {
//   const parsed = {};
//   for (const attr of attributes) {
//     parsed[attr.trait_type] = attr.value;
//   }
//   return parsed;
// }

// function mapToDbRow(nft) {
//   const attrs = parseAttributes(nft.metadata?.attributes || []);

//   return {
//     token_id:                         String(nft.id),
//     contract_address:                 CONTRACT_ADDRESS.toLowerCase(),
//     owner_address:                    nft.owner?.toLowerCase() || null,
//     token_uri:                        nft.tokenURI || null,
//     image_uri:                        nft.metadata?.image || null,
//     raw_metadata:                     nft.metadata || null,

//     // Album fields from attributes
//     item_type:                        attrs.itemType || null,
//     album_title:                      attrs.albumTitle || nft.metadata?.name || null,
//     primary_artist:                   attrs.primaryArtist || null,
//     featuring_artists:                attrs.featuringArtists
//                                         ? Array.isArray(attrs.featuringArtists)
//                                           ? attrs.featuringArtists
//                                           : [attrs.featuringArtists]
//                                         : [],
//     release_year:                     attrs.releaseYear ? parseInt(attrs.releaseYear) : null,
//     genre:                            attrs.genre || null,
//     subgenre:                         attrs.subgenre || null,
//     label:                            attrs.label || null,
//     catalog_number:                   attrs.catalogNumber || null,
//     barcode:                          attrs.barcode || null,
//     matrix_runout:                    attrs.matrixRunout || null,
//     album_format:                     attrs.albumFormat || null,
//     speed_rpm:                        attrs.speedRPM ? parseInt(attrs.speedRPM) : null,
//     disc_count:                       attrs.discCount ? parseInt(attrs.discCount) : null,
//     is_double_lp:                     attrs.isDoubleLP === true || attrs.isDoubleLP === 'true',
//     is_gatefold:                      attrs.isGatefold === true || attrs.isGatefold === 'true',
//     is_picture_disc:                  attrs.isPictureDisc === true || attrs.isPictureDisc === 'true',
//     vinyl_color:                      attrs.vinylColor || null,
//     edition_label:                    attrs.editionLabel || null,
//     pressing_region:                  attrs.pressingRegion || null,
//     sleeve_condition:                 attrs.sleeveCondition || null,
//     vinyl_condition:                  attrs.vinylCondition || null,
//     is_sealed:                        attrs.isSealed === true || attrs.isSealed === 'true',
//     is_cover_only:                    attrs.isCoverOnly === true || attrs.isCoverOnly === 'true',
//     is_vinyl_only:                    attrs.isVinylOnly === true || attrs.isVinylOnly === 'true',
//     includes_original_inner_sleeve:   attrs.includesOriginalInnerSleeve === true || attrs.includesOriginalInnerSleeve === 'true',
//     includes_insert:                  attrs.includesInsert === true || attrs.includesInsert === 'true',
//     insert_description:               attrs.insertDescription || null,
//     is_promo_copy:                    attrs.isPromoCopy === true || attrs.isPromoCopy === 'true',
//     track_highlight:                  attrs.trackHighlight || null,
//     era_tag:                          attrs.eraTag || null,
//     album_description:                nft.metadata?.description || attrs.albumDescription || null,
//     album_notes:                      attrs.albumNotes || null,
//   };
// }

// export async function POST(request) {
//   try {
//     // Security check - only allow calls with service role
//     const authHeader = request.headers.get('authorization');
//     if (authHeader !== `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`) {
//       return NextResponse.json(
//         { error: 'Unauthorized' },
//         { status: 401 }
//       );
//     }

//     if (!CONTRACT_ADDRESS) {
//       return NextResponse.json(
//         { error: 'Contract address not configured' },
//         { status: 500 }
//       );
//     }

//     // Get contract
//     const contract = getContract({
//       client,
//       chain: ethereum,
//       address: CONTRACT_ADDRESS,
//     });

//     // Fetch all NFTs from thirdweb
//     const nfts = await getNFTs({
//       contract,
//       includeOwners: true,
//     });

//     if (!nfts || nfts.length === 0) {
//       await supabaseServer.from('sync_logs').insert({
//         tokens_found: 0,
//         tokens_added: 0,
//         status: 'success',
//         trigger: 'manual',
//       });

//       return NextResponse.json({
//         message: 'No tokens found on contract',
//         tokens_found: 0,
//         tokens_added: 0,
//       });
//     }

//     // Map NFTs to our db structure
//     const rows = nfts.map(mapToDbRow);

//     // Upsert — insert new, update existing (based on token_id + contract_address)
//     const { data, error } = await supabaseServer
//       .from('tokens')
//       .upsert(rows, {
//         onConflict: 'token_id,contract_address',
//         ignoreDuplicates: false,
//       })
//       .select();

//     if (error) {
//       await supabaseServer.from('sync_logs').insert({
//         tokens_found: nfts.length,
//         tokens_added: 0,
//         status: 'failed',
//         error_message: error.message,
//         trigger: 'manual',
//       });

//       return NextResponse.json(
//         { error: 'Database error', details: error.message },
//         { status: 500 }
//       );
//     }

//     // Log successful sync
//     await supabaseServer.from('sync_logs').insert({
//       tokens_found: nfts.length,
//       tokens_added: data?.length || 0,
//       status: 'success',
//       trigger: 'manual',
//     });

//     return NextResponse.json({
//       message: 'Sync successful',
//       tokens_found: nfts.length,
//       tokens_added: data?.length || 0,
//     });

//   } catch (err) {
//     console.error('Sync error:', err);

//     await supabaseServer.from('sync_logs').insert({
//       tokens_found: 0,
//       tokens_added: 0,
//       status: 'failed',
//       error_message: err.message,
//       trigger: 'manual',
//     });

//     return NextResponse.json(
//       { error: 'Internal server error', details: err.message },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from 'next/server';
import { getContract } from 'thirdweb';
import { getNFTs } from 'thirdweb/extensions/erc721';
import { ethereum } from 'thirdweb/chains';
import { client } from '@/lib/thirdweb-client';
import { supabaseServer } from '@/lib/supabase-server';

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

function resolveIpfs(uri) {
  if (!uri) return null;
  if (uri.startsWith('ipfs://')) return 'https://ipfs.io/ipfs/' + uri.slice(7);
  return uri;
}

async function fetchIpfsMetadata(tokenUri) {
  try {
    const url = resolveIpfs(tokenUri);
    if (!url) return null;
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('IPFS fetch failed for', tokenUri, err.message);
    return null;
  }
}

function parseAttributes(attributes = []) {
  const parsed = {};
  for (const attr of attributes) {
    parsed[attr.trait_type] = attr.value;
  }
  return parsed;
}

function mapToDbRow(nft, metadata) {
  const attrs = parseAttributes(metadata?.attributes || []);

  return {
    token_id:                         String(nft.id),
    contract_address:                 CONTRACT_ADDRESS.toLowerCase(),
    owner_address:                    nft.owner?.toLowerCase() || null,
    token_uri:                        nft.tokenURI || null,
    image_uri:                        metadata?.image || null,
    raw_metadata:                     metadata || nft.metadata || null,

    item_type:                        attrs.itemType || null,
    album_title:                      attrs.albumTitle || metadata?.name || null,
    primary_artist:                   attrs.primaryArtist || null,
    featuring_artists:                attrs.featuringArtists
                                        ? Array.isArray(attrs.featuringArtists)
                                          ? attrs.featuringArtists
                                          : [attrs.featuringArtists]
                                        : [],
    release_year:                     attrs.releaseYear ? parseInt(attrs.releaseYear) : null,
    genre:                            attrs.genre || null,
    subgenre:                         attrs.subgenre || null,
    label:                            attrs.label || null,
    catalog_number:                   attrs.catalogNumber || null,
    barcode:                          attrs.barcode || null,
    matrix_runout:                    attrs.matrixRunout || null,
    album_format:                     attrs.albumFormat || null,
    speed_rpm:                        attrs.speedRPM ? parseInt(attrs.speedRPM) : null,
    disc_count:                       attrs.discCount ? parseInt(attrs.discCount) : null,
    is_double_lp:                     attrs.isDoubleLP === true || attrs.isDoubleLP === 'true',
    is_gatefold:                      attrs.isGatefold === true || attrs.isGatefold === 'true',
    is_picture_disc:                  attrs.isPictureDisc === true || attrs.isPictureDisc === 'true',
    vinyl_color:                      attrs.vinylColor || null,
    edition_label:                    attrs.editionLabel || null,
    pressing_region:                  attrs.pressingRegion || null,
    sleeve_condition:                 attrs.sleeveCondition || null,
    vinyl_condition:                  attrs.vinylCondition || null,
    is_sealed:                        attrs.isSealed === true || attrs.isSealed === 'true',
    is_cover_only:                    attrs.isCoverOnly === true || attrs.isCoverOnly === 'true',
    is_vinyl_only:                    attrs.isVinylOnly === true || attrs.isVinylOnly === 'true',
    includes_original_inner_sleeve:   attrs.includesOriginalInnerSleeve === true || attrs.includesOriginalInnerSleeve === 'true',
    includes_insert:                  attrs.includesInsert === true || attrs.includesInsert === 'true',
    insert_description:               attrs.insertDescription || null,
    is_promo_copy:                    attrs.isPromoCopy === true || attrs.isPromoCopy === 'true',
    track_highlight:                  attrs.trackHighlight || null,
    era_tag:                          attrs.eraTag || null,
    album_description:                metadata?.description || attrs.albumDescription || null,
    album_notes:                      attrs.albumNotes || null,
  };
}

export async function POST(request) {
  try {
    // Security check
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!CONTRACT_ADDRESS) {
      return NextResponse.json({ error: 'Contract address not configured' }, { status: 500 });
    }

    // Get contract
    const contract = getContract({
      client,
      chain: ethereum,
      address: CONTRACT_ADDRESS,
    });

    // Fetch all NFTs from thirdweb
    const nfts = await getNFTs({ contract, includeOwners: true });

    if (!nfts || nfts.length === 0) {
      await supabaseServer.from('sync_logs').insert({
        tokens_found: 0, tokens_added: 0, status: 'success', trigger: 'manual',
      });
      return NextResponse.json({ message: 'No tokens found on contract', tokens_found: 0, tokens_added: 0 });
    }

    // Fetch IPFS metadata for each NFT
    console.log(`[Sync] Fetching IPFS metadata for ${nfts.length} tokens...`);
    const metadataResults = await Promise.all(
      nfts.map(nft => fetchIpfsMetadata(nft.tokenURI))
    );

    // Map NFTs + their IPFS metadata to DB rows
    const rows = nfts.map((nft, i) => mapToDbRow(nft, metadataResults[i]));

    // Log what we resolved
    const resolved = metadataResults.filter(Boolean).length;
    console.log(`[Sync] Resolved ${resolved}/${nfts.length} IPFS metadata responses`);

    // Upsert into Supabase
    const { data, error } = await supabaseServer
      .from('tokens')
      .upsert(rows, { onConflict: 'token_id,contract_address', ignoreDuplicates: false })
      .select();

    if (error) {
      await supabaseServer.from('sync_logs').insert({
        tokens_found: nfts.length, tokens_added: 0, status: 'failed',
        error_message: error.message, trigger: 'manual',
      });
      return NextResponse.json({ error: 'Database error', details: error.message }, { status: 500 });
    }

    await supabaseServer.from('sync_logs').insert({
      tokens_found: nfts.length, tokens_added: data?.length || 0,
      status: 'success', trigger: 'manual',
    });

    return NextResponse.json({
      message: 'Sync successful',
      tokens_found: nfts.length,
      tokens_added: data?.length || 0,
      metadata_resolved: resolved,
    });

  } catch (err) {
    console.error('Sync error:', err);
    await supabaseServer.from('sync_logs').insert({
      tokens_found: 0, tokens_added: 0, status: 'failed',
      error_message: err.message, trigger: 'manual',
    });
    return NextResponse.json({ error: 'Internal server error', details: err.message }, { status: 500 });
  }
}