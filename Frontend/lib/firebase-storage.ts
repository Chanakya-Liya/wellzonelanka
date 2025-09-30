// lib/firebase-storage.ts
import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject, listAll, getMetadata } from 'firebase/storage';

export interface FileUploadResult {
  success: boolean;
  downloadURL?: string;
  error?: string;
}

export interface FileInfo {
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: string;
}

/**
 * Uploads a file to Firebase Storage
 * @param file - The file to upload
 * @param folder - The folder path (e.g., 'certificates', 'documents')
 * @param userId - The user ID for organization
 * @param fileName - Optional custom filename
 * @returns Promise with upload result
 */
export async function uploadFile(
  file: File,
  folder: string,
  userId: string,
  fileName?: string
): Promise<FileUploadResult> {
  try {
    // Validate file
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return { success: false, error: 'File size must be less than 10MB' };
    }

    // Check file type (allow common document and image formats)
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      return { 
        success: false, 
        error: 'File type not supported. Please upload PDF, images, or document files.' 
      };
    }

    // Generate unique filename if not provided
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const finalFileName = fileName || `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    // Create storage reference
    const storagePath = `${folder}/${userId}/${finalFileName}`;
    const storageRef = ref(storage, storagePath);

    // Upload file
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return {
      success: true,
      downloadURL
    };

  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    };
  }
}

/**
 * Downloads a file from Firebase Storage
 * @param filePath - The full path to the file in storage
 * @returns Promise with download URL
 */
export async function getFileDownloadURL(filePath: string): Promise<string | null> {
  try {
    const storageRef = ref(storage, filePath);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error getting download URL:', error);
    return null;
  }
}

/**
 * Deletes a file from Firebase Storage
 * @param filePath - The full path to the file in storage
 * @returns Promise with success status
 */
export async function deleteFile(filePath: string): Promise<boolean> {
  try {
    const storageRef = ref(storage, filePath);
    await deleteObject(storageRef);
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}

/**
 * Lists all files in a user's folder
 * @param folder - The folder path
 * @param userId - The user ID
 * @returns Promise with array of file info
 */
export async function listUserFiles(folder: string, userId: string): Promise<FileInfo[]> {
  try {
    const folderRef = ref(storage, `${folder}/${userId}`);
    const result = await listAll(folderRef);
    
    const files: FileInfo[] = [];
    
    for (const itemRef of result.items) {
      try {
        const downloadURL = await getDownloadURL(itemRef);
        const metadata = await getMetadata(itemRef);
        
        files.push({
          name: itemRef.name,
          url: downloadURL,
          size: metadata.size || 0,
          type: metadata.contentType || 'unknown',
          uploadedAt: metadata.timeCreated || new Date().toISOString()
        });
      } catch (error) {
        console.error(`Error getting file info for ${itemRef.name}:`, error);
      }
    }
    
    return files;
  } catch (error) {
    console.error('Error listing files:', error);
    return [];
  }
}

/**
 * Generates a file path for storage
 * @param folder - The folder path
 * @param userId - The user ID
 * @param fileName - The file name
 * @returns Storage path string
 */
export function generateFilePath(folder: string, userId: string, fileName: string): string {
  return `${folder}/${userId}/${fileName}`;
}

/**
 * Extracts file info from storage path
 * @param filePath - The storage path
 * @returns File info object
 */
export function parseFilePath(filePath: string) {
  const parts = filePath.split('/');
  return {
    folder: parts[0],
    userId: parts[1],
    fileName: parts.slice(2).join('/')
  };
}