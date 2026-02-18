import { savePendingReport as savePendingReportDB } from '@/lib/indexedDB';
import type { Report } from '@/types/report';

interface PendingReportData {
  category: string;
  severity: string;
  description: string;
  latitude: number;
  longitude: number;
  image: File;
}

/**
 * Save report to IndexedDB for offline sync
 */
export async function saveReportOffline(reportData: PendingReportData): Promise<string> {
  // Store the file as base64 for offline storage
  const base64Image = await fileToBase64(reportData.image);
  
  const offlineData = {
    category: reportData.category,
    severity: reportData.severity,
    description: reportData.description,
    latitude: reportData.latitude,
    longitude: reportData.longitude,
    image_url: base64Image,
    imageFile: {
      name: reportData.image.name,
      type: reportData.image.type,
      size: reportData.image.size
    }
  };

  return savePendingReportDB(offlineData);
}

/**
 * Convert File to base64 string
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

/**
 * Convert base64 to File
 */
export function base64ToFile(base64: string, filename: string, mimeType: string): File {
  const arr = base64.split(',');
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, { type: mimeType });
}

/**
 * Check if browser is online
 */
export function isOnline(): boolean {
  return navigator.onLine;
}
