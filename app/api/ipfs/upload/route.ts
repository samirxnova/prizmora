import { NextResponse } from 'next/server';
import { uploadToIPFS } from '@/lib/ipfs';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const cid = await uploadToIPFS(file);

    return NextResponse.json({ cid });
  } catch (error: any) {
    console.error('Error in IPFS file upload API route:', error);
    return NextResponse.json(
      { error: 'Failed to upload file to IPFS', details: error.message },
      { status: 500 }
    );
  }
} 