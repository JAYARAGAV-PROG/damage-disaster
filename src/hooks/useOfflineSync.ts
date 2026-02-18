import { useEffect, useState } from 'react';
import { createReportWithImage } from '@/services/apiService';
import { getPendingReports, removePendingReport } from '@/lib/indexedDB';
import { base64ToFile, isOnline } from '@/lib/offlineStorage';
import { toast } from 'sonner';

export function useOfflineSync() {
  const [syncing, setSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const syncPendingReports = async () => {
    if (!isOnline() || syncing) return;

    setSyncing(true);
    try {
      const pending = await getPendingReports();
      setPendingCount(pending.length);

      if (pending.length === 0) {
        setSyncing(false);
        return;
      }

      toast.info(`Syncing ${pending.length} pending report(s)...`);

      for (const item of pending) {
        try {
          const { reportData } = item;
          
          // Convert base64 image back to File
          const imageFile = base64ToFile(
            reportData.image_url,
            reportData.imageFile.name,
            reportData.imageFile.type
          );

          // Create FormData
          const formData = new FormData();
          formData.append('category', reportData.category);
          formData.append('severity', reportData.severity);
          formData.append('description', reportData.description);
          formData.append('latitude', reportData.latitude.toString());
          formData.append('longitude', reportData.longitude.toString());
          formData.append('image', imageFile);

          // Submit to backend
          await createReportWithImage(formData);
          
          // Remove from IndexedDB after successful sync
          await removePendingReport(item.id);
          setPendingCount((prev) => prev - 1);
        } catch (error) {
          console.error('Failed to sync report:', error);
        }
      }

      toast.success('All pending reports synced successfully!');
    } catch (error) {
      console.error('Error syncing pending reports:', error);
      toast.error('Failed to sync some reports');
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    // Check pending reports on mount
    getPendingReports().then((reports) => {
      setPendingCount(reports.length);
    });

    // Sync when coming online
    const handleOnline = () => {
      syncPendingReports();
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  return { syncing, pendingCount, syncPendingReports };
}
