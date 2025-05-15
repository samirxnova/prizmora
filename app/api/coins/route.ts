import { NextResponse } from 'next/server';
import {
  // getCoins as getCoinsByAddressDetails, // Retained for potential direct coin detail fetching if needed elsewhere, but not for explore/profile lists.
  getCoinsNew,
  getCoinsTopGainers, // Added for trending coins
  setApiKey
} from '@zoralabs/coins-sdk';
import type { CoinDetails } from '@/types/zora';
import { Address } from 'viem'; // Import Address type if needed for parameters

if (process.env.NEXT_PUBLIC_ZORA_API_KEY) {
  setApiKey(process.env.NEXT_PUBLIC_ZORA_API_KEY);
  console.log("Zora API Key set for /api/coins route");
} else {
  console.warn("Zora API Key not found. SDK calls might be rate-limited or fail.");
}

const adaptToCoinDetails = (sdkCoin: any): CoinDetails => {
  // Robust mapping for different SDK response structures from explore/profile queries
  return {
    address: sdkCoin.address || sdkCoin.collectionAddress || sdkCoin.contractAddress,
    name: sdkCoin.name,
    symbol: sdkCoin.symbol,
    uri: sdkCoin.token?.metadata?.content?.uri || sdkCoin.token?.metadata?.image?.uri || sdkCoin.token?.imageURI || sdkCoin.imageURI || sdkCoin.uri,
    creator: sdkCoin.creatorAddress || sdkCoin.minter || sdkCoin.owner,
    createdAt: sdkCoin.createdAtTimestamp ? new Date(parseInt(sdkCoin.createdAtTimestamp) * 1000).toISOString() :
               sdkCoin.firstMintedTimestamp ? new Date(parseInt(sdkCoin.firstMintedTimestamp) * 1000).toISOString() :
               sdkCoin.createdAt ? new Date(sdkCoin.createdAt).toISOString() : // For direct date strings
               new Date().toISOString(),
    totalSupply: sdkCoin.totalSupply?.toString() || "0",
    holders: sdkCoin.holderCount || sdkCoin.ownerCount || sdkCoin.totalMinted || 0, // totalMinted as a proxy for holders if others are absent
    metadata: sdkCoin.metadata || sdkCoin.token?.metadata,
  } as CoinDetails;
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const countParam = searchParams.get('count') || '10';
    const limit = parseInt(countParam, 10);
    const userAddressParam = searchParams.get('address'); // Renamed for clarity
    const after = searchParams.get('after') || undefined;

    let sdkResponse: any; // Changed variable name for clarity

    switch (type) {
      case 'trending':
        if (typeof getCoinsTopGainers === 'function') {
          sdkResponse = await getCoinsTopGainers({ 
            count: limit, 
            after: after 
          });
        } else {
          console.error("getCoinsTopGainers function not found in Zora SDK.");
          return NextResponse.json({ error: "Functionality for trending coins is not available.", coins: [], pageInfo: {} }, { status: 501 });
        }
        break;
      case 'new':
        if (typeof getCoinsNew === 'function') {
          sdkResponse = await getCoinsNew({ 
            count: limit, 
            after: after 
          }); 
        } else {
          console.error("getCoinsNew function not found in Zora SDK.");
          return NextResponse.json({ error: "Functionality for new coins is not available.", coins: [], pageInfo: {} }, { status: 501 });
        }
        break;
      case 'user':
        if (!userAddressParam) {
          return NextResponse.json({ error: 'Address parameter is required for user coins' }, { status: 400 });
        }
        // TODO: Implement user coin fetching using the Zora SDK.
        // This requires finding the correct "Profile Query" function from the Zora SDK documentation
        // that allows fetching coins owned or created by a specific wallet address (userAddressParam).
        // The function should ideally support pagination (limit, after).
        // Example (hypothetical function, replace with actual):
        // sdkResponse = await getCoinsByOwner({ ownerAddress: userAddressParam as Address, count: limit, after: after });
        console.error("SDK function for 'user' coins needs to be implemented with a specific Zora SDK Profile Query.");
        return NextResponse.json({ error: "User coins functionality requires implementation with the correct Zora SDK Profile Query.", coins: [], pageInfo: {} }, { status: 501 });
      default:
        return NextResponse.json({ error: 'Invalid type parameter. Must be one of: trending, new, user' }, { status: 400 });
    }

    // Standardize access to list and pageInfo from SDK explore/profile queries
    const items = sdkResponse?.data?.exploreList?.edges?.map((edge: any) => adaptToCoinDetails(edge.node)) || [];
    const pageInfo = sdkResponse?.data?.exploreList?.pageInfo || {};

    return NextResponse.json({ coins: items, pageInfo });

  } catch (error: any) {
    console.error(`Error in /api/coins (type: ${new URL(request.url).searchParams.get('type')}):`, error.message, error.stack);
    // Check for Zora SDK specific error structures if available
    if (error.status && error.message) {
        return NextResponse.json({ error: `Zora SDK Error: ${error.message}`, details: error.errors || error.message, status: error.status }, { status: error.status });
    }
    return NextResponse.json({ error: 'Failed to fetch coins from Zora', details: error.message }, { status: 500 });
  }
} 