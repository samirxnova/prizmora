import { Address } from "viem";

export interface CreateCoinParams {
  name: string;
  symbol: string;
  uri: string;
  payoutRecipient: Address;
  platformReferrer?: Address;
  initialPurchaseWei?: bigint;
}

export interface CoinDetails {
  address: Address;
  name: string;
  symbol: string;
  uri: string;
  creator: Address;
  createdAt: string;
  totalSupply: string;
  holders: number;
  metadata?: CoinMetadata;
}

export interface CoinMetadata {
  name: string;
  description: string;
  image: string;
  content?: {
    mime: string;
    uri: string;
  };
  properties?: {
    category?: string;
    type?: string;
    creationDate?: string;
    [key: string]: any;
  };
}

export interface CoinCreationResult {
  success: boolean;
  hash?: string;
  address?: Address;
  error?: string;
  deployment?: {
    address: Address;
    blockNumber?: number;
    transactionHash: string;
  };
} 