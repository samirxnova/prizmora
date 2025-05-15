import { PinataSDK } from 'pinata-web3';
import { Readable } from 'stream';

// Initialize Pinata SDK client
const getPinataSDK = () => {
  const jwt = process.env.PINATA_JWT;
  const gateway = process.env.PINATA_GATEWAY;

  if (!jwt) {
    throw new Error('Pinata JWT not found in environment variables. Please set PINATA_JWT.');
  }
  if (!gateway) {
    // Gateway is used for constructing URLs but not strictly required for SDK init for uploads.
    // However, our getIPFSGatewayURL relies on it, so we can warn or make it optional there.
    console.warn('Pinata Gateway URL not found in environment variables (PINATA_GATEWAY). Uploads will work, but getIPFSGatewayURL will use public fallback.');
  }

  return new PinataSDK({
    pinataJwt: jwt,
    // pinataGateway is used by SDK for its gateway methods, not directly for uploads, but good to init if available.
    pinataGateway: gateway || 'gateway.pinata.cloud', // Default to a public one if not set for SDK internal uses
  });
};

// Upload file to IPFS via Pinata
export async function uploadToIPFS(file: File | Blob): Promise<string> {
  try {
    const pinata = getPinataSDK();
    
    const fileName = (file instanceof File) ? file.name || `file-${Date.now()}` : `blob-${Date.now()}`;
    // Ensure the file object is a proper File instance for the SDK, and importantly, has a .name property
    const fileToUpload = (file instanceof File) ? (file.name ? file : new File([await file.arrayBuffer()], fileName, { type: file.type })) : new File([await file.arrayBuffer()], fileName, { type: file.type });
    
    // Calling without the second options argument, assuming name is taken from File.name
    // and cidVersion defaults to a reasonable value (usually 1 for modern IPFS).
    const result = await pinata.upload.file(fileToUpload);

    if (!result || !result.IpfsHash) {
      throw new Error('Failed to pin file to Pinata or IpfsHash not returned.');
    }
    return result.IpfsHash; 
  } catch (error) {
    console.error('Error uploading file to Pinata:', error);
    throw new Error('Failed to upload content to Pinata/IPFS');
  }
}

// Upload JSON to IPFS via Pinata
export async function uploadJSONToIPFS(json: any): Promise<string> {
  try {
    const pinata = getPinataSDK();
        
    // Calling without the second options argument for JSON.
    // The name on Pinata for this JSON might be auto-generated if not specifiable here.
    const result = await pinata.upload.json(json);

    if (!result || !result.IpfsHash) {
      throw new Error('Failed to pin JSON to Pinata or IpfsHash not returned.');
    }
    return result.IpfsHash;
  } catch (error) {
    console.error('Error uploading JSON to Pinata:', error);
    throw new Error('Failed to upload metadata to Pinata/IPFS');
  }
}

// Get IPFS gateway URL using Pinata's configured gateway
export function getIPFSGatewayURL(cid: string): string {
  const gateway = process.env.PINATA_GATEWAY;
  if (!gateway) {
    console.warn('Pinata Gateway URL (PINATA_GATEWAY) not set, defaulting to public Pinata gateway.');
    return `https://gateway.pinata.cloud/ipfs/${cid}`; // Fallback public gateway
  }
  // Ensure no double slashes and correct protocol
  const cleanGateway = gateway.replace(/\/$/, ''); // Remove trailing slash if any
  return `${cleanGateway.startsWith('http') ? cleanGateway : `https://${cleanGateway}`}/ipfs/${cid}`;
} 