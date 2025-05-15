import { NextResponse } from 'next/server';
import { uploadJSONToIPFS } from '@/lib/ipfs';

export async function POST(request: Request) {
  try {
    const json = await request.json();
    
    if (!json) {
      return NextResponse.json(
        { error: 'No JSON data provided' },
        { status: 400 }
      );
    }

    const cid = await uploadJSONToIPFS(json);

    return NextResponse.json({ cid });
  } catch (error: any) {
    console.error('Error in IPFS JSON upload API route:', error);
    return NextResponse.json(
      { error: 'Failed to upload JSON to IPFS', details: error.message },
      { status: 500 }
    );
  }
} 