// app/api/admin/download-file/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getFileDownloadURL } from '@/lib/firebase-storage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileUrl = searchParams.get('fileUrl');

    if (!fileUrl) {
      return NextResponse.json(
        { success: false, error: 'File URL is required' },
        { status: 400 }
      );
    }

    // For security, you might want to validate that the file URL belongs to your storage
    if (!fileUrl.includes('firebasestorage.googleapis.com')) {
      return NextResponse.json(
        { success: false, error: 'Invalid file URL' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      downloadURL: fileUrl,
      message: 'File URL retrieved successfully'
    });

  } catch (error) {
    console.error('Download file API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}