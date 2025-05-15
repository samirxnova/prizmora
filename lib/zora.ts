import { 
  createCoin,
  getCoinCreateFromLogs,
  validateMetadataJSON,
  setApiKey,
} from "@zoralabs/coins-sdk";
import { Address, WalletClient, PublicClient } from "viem";
import { uploadToIPFS, uploadJSONToIPFS } from './ipfs';
import type { CreateCoinParams, CoinDetails, CoinCreationResult } from '@/types/zora';

// Set API key if available
if (process.env.NEXT_PUBLIC_ZORA_API_KEY) {
  setApiKey(process.env.NEXT_PUBLIC_ZORA_API_KEY);
}

// Metadata Preparation
export async function prepareMetadata(
  content: File | Blob,
  title: string,
  description: string
): Promise<string> {
  try {
    console.log(`Preparing metadata for: ${title}`);
    
    // Upload content to IPFS
    const contentCID = await uploadToIPFS(content);
    console.log(`Content uploaded to IPFS with CID: ${contentCID}`);
    
    // Build metadata JSON
    const metadata = {
      name: title,
      description: description,
      image: `ipfs://${contentCID}`,
      content: {
        mime: content.type,
        uri: `ipfs://${contentCID}`
      },
      properties: {
        category: "AI Art",
        type: "Fusion Art",
        creationDate: new Date().toISOString()
      }
    };
    
    // Validate metadata
    try {
      validateMetadataJSON(metadata);
    } catch (error) {
      console.error("Metadata validation error:", error);
      throw new Error(`Invalid metadata: ${(error as Error).message}`);
    }
    
    // Upload metadata to IPFS
    const metadataCID = await uploadJSONToIPFS(metadata);
    console.log(`Metadata uploaded to IPFS with CID: ${metadataCID}`);
    
    return `ipfs://${metadataCID}`;
  } catch (error) {
    console.error("Error preparing metadata:", error);
    throw new Error(`Error preparing metadata: ${(error as Error).message}`);
  }
}

// Coin Creation
export async function createContentCoin(
  walletClient: WalletClient,
  publicClient: PublicClient,
  contentData: {
    content: File | Blob;
    title: string;
    symbol: string;
    description: string;
    creatorAddress: Address;
  }
): Promise<CoinCreationResult> {
  const { content, title, symbol, description, creatorAddress } = contentData;
  
  if (!walletClient || !walletClient.account) {
    return {
      success: false,
      error: "Wallet not connected. Please connect your wallet and try again."
    };
  }

  if (!publicClient) {
    return {
      success: false,
      error: "Network connection error. Please reload the page and try again."
    };
  }
  
  try {
    console.log("Starting metadata preparation...");
    const metadataURI = await prepareMetadata(content, title, description);
    console.log("Metadata prepared successfully:", metadataURI);
    
    const platformReferrer = process.env.NEXT_PUBLIC_PLATFORM_REFERRER_ADDRESS as Address;
    
    const createCoinParams: CreateCoinParams = {
      name: title,
      symbol: symbol,
      uri: metadataURI,
      payoutRecipient: creatorAddress,
      platformReferrer
    };
    
    console.log("Creating coin with params:", {
      ...createCoinParams,
      creatorAddress: creatorAddress,
    });
    
    const result = await createCoin(createCoinParams, walletClient, publicClient);
    console.log('✅ createCoin result:', result);
    
    if (!result || !result.hash || !result.address) {
      console.error("Coin creation failed or result is incomplete:", result);
      return { success: false, error: "Coin creation failed or result is incomplete." };
    }
    
    return {
      success: true,
      hash: result.hash,
      address: result.address,
      deployment: {
        address: result.address,
        transactionHash: result.hash,
      }
    };
  } catch (error: any) {
    console.error("Error creating coin:", error);
    
    let errorMessage = "Error creating coin.";
    
    if (error.message) {
      if (error.message.includes("user rejected transaction")) {
        errorMessage = "Transaction was rejected in your wallet.";
      } else if (error.message.includes("insufficient funds")) {
        errorMessage = "Insufficient funds in your wallet.";
      } else {
        errorMessage += ` ${error.message}`;
      }
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
}

// Extract coin address from transaction receipt
export function extractCoinAddressFromReceipt(receipt: any): Address | undefined {
  try {
    if (!receipt) {
      console.error("Receipt is undefined or null");
      return undefined;
    }
    
    const coinDeployment = getCoinCreateFromLogs(receipt);
    console.log("Extracted coin address from receipt:", coinDeployment);
    return coinDeployment?.coin;
  } catch (error) {
    console.error("Error extracting coin address from receipt:", error);
    return undefined;
  }
}

// Fetch coin data from API
export async function fetchCoinsData(endpoint: string, params?: Record<string, string>): Promise<CoinDetails[]> {
  try {
    const queryParams = new URLSearchParams(params || {});
    const apiUrl = `${endpoint}?${queryParams.toString()}`;
    
    console.log(`Fetching coin data from: ${apiUrl}`);
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    return data.coins || [];
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    return [];
  }
}

// Get trending coins
export async function getTrendingCoins(count = 10): Promise<CoinDetails[]> {
  return fetchCoinsData('/api/coins/trending', { count: count.toString() });
}

// Get new coins
export async function getNewCoins(count = 10): Promise<CoinDetails[]> {
  return fetchCoinsData('/api/coins/new', { count: count.toString() });
}

// Get user's coins
export async function getUserCoins(address: string): Promise<CoinDetails[]> {
  return fetchCoinsData('/api/coins/user', { address });
} 