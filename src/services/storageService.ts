import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL,
  getStorage
} from 'firebase/storage';
import app from '../lib/firebase';

// Initialize Storage instance from main app
const storage = getStorage(app);

/**
 * Storage Upload Progress and Result Interface
 */
export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  progressPercentage: number;
  downloadUrl?: string;
  error?: string;
}

export type StorageEngine = 'server' | 'firebase';

// Helper: Converts a File object to base64 string with progress simulation.
function fileToBase64(file: File, onProgress?: (percent: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.min(85, Math.round((event.loaded / event.total) * 85));
        onProgress?.(percent);
      }
    };

    reader.onload = () => {
      onProgress?.(90);
      resolve(reader.result as string);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Format bytes to readable string (e.g. 2.4 MB)
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

/**
 * Helper: Detect whether a link is a Google Drive link
 */
export function isGoogleDriveLink(url: string): boolean {
  if (!url) return false;
  return url.includes('drive.google.com') || url.includes('docs.google.com');
}

/**
 * Helper: Parse Google Drive share URL and return both preview and direct download URLs.
 * Works with:
 * - https://drive.google.com/file/d/{FILE_ID}/view?usp=sharing
 * - https://drive.google.com/open?id={FILE_ID}
 * - https://drive.google.com/uc?id={FILE_ID}
 */
export function parseGoogleDriveUrl(url: string): { fileId: string | null; previewUrl: string; downloadUrl: string } | null {
  if (!url) return null;
  const trimmed = url.trim();

  let fileId: string | null = null;
  const matchFile = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matchFile && matchFile[1]) {
    fileId = matchFile[1];
  } else {
    const matchId = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (matchId && matchId[1]) {
      fileId = matchId[1];
    }
  }

  if (!fileId) return null;

  return {
    fileId,
    previewUrl: `https://drive.google.com/file/d/${fileId}/preview`,
    downloadUrl: `https://drive.google.com/uc?export=download&id=${fileId}`
  };
}

/**
 * Internal: Direct upload to website server endpoint (/api/upload/pdf).
 * 100% Free, zero external credentials or cloud storage buckets required.
 */
async function uploadPdfToServer(
  file: File,
  onProgress?: (percent: number) => void
): Promise<{ downloadUrl: string; fileName: string; fileSizeFormatted: string }> {
  onProgress?.(15);
  const base64 = await fileToBase64(file, (p) => {
    // 15% - 75%
    const scaled = 15 + Math.round(p * 0.6);
    onProgress?.(scaled);
  });

  onProgress?.(80);

  const response = await fetch('/api/upload/pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileName: file.name,
      fileData: base64
    })
  });

  onProgress?.(95);

  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    throw new Error(errJson.error || `Server upload failed (${response.status} ${response.statusText})`);
  }

  const data = await response.json();
  onProgress?.(100);

  return {
    downloadUrl: data.downloadUrl,
    fileName: file.name,
    fileSizeFormatted: formatBytes(file.size)
  };
}

/**
 * Internal: Direct upload image to website server endpoint (/api/upload/image).
 */
async function uploadImageToServer(
  file: File,
  onProgress?: (percent: number) => void
): Promise<string> {
  onProgress?.(20);
  const base64 = await fileToBase64(file, (p) => {
    const scaled = 20 + Math.round(p * 0.6);
    onProgress?.(scaled);
  });

  onProgress?.(85);

  const response = await fetch('/api/upload/image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileName: file.name,
      fileData: base64
    })
  });

  onProgress?.(95);

  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    throw new Error(errJson.error || 'Server image upload failed.');
  }

  const data = await response.json();
  onProgress?.(100);
  return data.downloadUrl;
}

/**
 * Upload an image (PNG, JPEG, WebP, SVG, GIF) for the Rich Text Note Editor.
 * Uses native Server Storage by default for instantaneous, zero-setup, reliable uploads.
 */
export async function uploadNoteImage(
  file: File, 
  onProgress?: (percent: number) => void
): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please select a valid image file (PNG, JPG, WebP, SVG).');
  }

  if (file.size > 15 * 1024 * 1024) {
    throw new Error('Image size exceeds 15MB limit. Please upload a smaller image.');
  }

  // Direct fast server upload
  try {
    return await uploadImageToServer(file, onProgress);
  } catch (err: any) {
    console.warn('Server image upload failed, checking fallback:', err);
    throw new Error(err.message || 'Image upload failed. Please try again.');
  }
}

/**
 * Upload a PDF document for Course Notes, Resources, or Topic Attached Material.
 * 
 * By default, uses native Server-Side Storage (/api/upload/pdf):
 * - Does NOT require Firebase Storage bucket
 * - Does NOT require Firebase Blaze plan or credit card
 * - Instantly saves to public/uploads/notes and provides a permanent direct download link.
 * 
 * If Firebase Storage is explicitly requested and configured, it can be passed via engine: 'firebase'.
 */
export async function uploadNotePdf(
  file: File,
  onProgress?: (percent: number) => void,
  engine: StorageEngine = 'server'
): Promise<{ downloadUrl: string; fileName: string; fileSizeFormatted: string }> {
  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  if (!isPdf) {
    throw new Error('Invalid file type. Please upload a valid .pdf document.');
  }

  // Max 50MB PDF limit
  if (file.size > 50 * 1024 * 1024) {
    throw new Error('PDF file size exceeds 50MB. Please compress or optimize the PDF.');
  }

  // 1. Primary: Instant Server Storage (Zero Blaze plan / No Firebase Storage required)
  if (engine === 'server') {
    return await uploadPdfToServer(file, onProgress);
  }

  // 2. Firebase Storage (if user explicitly chooses Firebase engine)
  try {
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
    const filePath = `course-notes-pdfs/${Date.now()}_${cleanName}`;
    const storageRef = ref(storage, filePath);

    const uploadTask = uploadBytesResumable(storageRef, file, {
      contentType: 'application/pdf',
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString()
      }
    });

    const downloadUrl = await new Promise<string>((resolve, reject) => {
      const timeoutTimer = setTimeout(() => {
        try { uploadTask.cancel(); } catch (_) {}
        reject(new Error('Firebase Storage timed out. Your Firebase project may not have a Storage bucket provisioned.'));
      }, 8000);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          if (snapshot.totalBytes > 0) {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            onProgress?.(progress);
          }
        },
        (error) => {
          clearTimeout(timeoutTimer);
          reject(error);
        },
        async () => {
          clearTimeout(timeoutTimer);
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(url);
          } catch (err) {
            reject(err);
          }
        }
      );
    });

    onProgress?.(100);
    return {
      downloadUrl,
      fileName: file.name,
      fileSizeFormatted: formatBytes(file.size)
    };
  } catch (fbErr: any) {
    console.warn('Firebase Storage failed, seamlessly switching to server upload:', fbErr);
    // Automatic fallback to server storage so user is never stuck!
    return await uploadPdfToServer(file, onProgress);
  }
}
