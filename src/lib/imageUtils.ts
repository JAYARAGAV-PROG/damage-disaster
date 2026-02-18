import imageCompression from 'browser-image-compression';

/**
 * Compress image to meet size requirements (under 1MB)
 */
export async function compressImage(file: File): Promise<File> {
  const maxSizeMB = 1;
  const maxWidthOrHeight = 1920;

  const options = {
    maxSizeMB,
    maxWidthOrHeight,
    useWebWorker: true,
    fileType: 'image/webp',
    initialQuality: 0.8
  };

  try {
    const compressedFile = await imageCompression(file, options);
    
    // Ensure filename is valid (only English letters and numbers)
    const sanitizedName = file.name
      .replace(/[^a-zA-Z0-9.]/g, '_')
      .replace(/_{2,}/g, '_');
    
    // Create new file with sanitized name
    return new File([compressedFile], sanitizedName, {
      type: compressedFile.type
    });
  } catch (error) {
    console.error('Error compressing image:', error);
    throw new Error('Failed to compress image');
  }
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];
  
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload JPEG, PNG, GIF, WEBP, or AVIF images.'
    };
  }

  const maxSize = 10 * 1024 * 1024; // 10MB before compression
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size too large. Maximum size is 10MB.'
    };
  }

  return { valid: true };
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
}
