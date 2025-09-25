// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { uploadFile } from '@/lib/firebase-storage';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string;
    const userId = formData.get('userId') as string;
    const fileName = formData.get('fileName') as string;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!folder || !userId) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Upload file to Firebase Storage
    const result = await uploadFile(file, folder, userId, fileName);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      downloadURL: result.downloadURL,
      message: 'File uploaded successfully'
    });

  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}