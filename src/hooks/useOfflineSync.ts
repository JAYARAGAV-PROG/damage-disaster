import { useEffect, useState } from 'react';
import { createReport } from '@/db/api';
import {
  getPendingReports,
  removePendingReport,
  isOnline
} from '@/lib/offlineStorage';
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
          await createReport(item.reportData);
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
