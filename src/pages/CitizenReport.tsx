import { ReportForm } from '@/components/ReportForm';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { isOnline } from '@/lib/offlineStorage';
import { useState, useEffect } from 'react';

export default function CitizenReport() {
  const { syncing, pendingCount, syncPendingReports } = useOfflineSync();
  const [online, setOnline] = useState(isOnline());

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-6 px-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">Post-Disaster Damage Assessment</h1>
          <p className="text-sm mt-2 opacity-90">
            Report infrastructure damage to help authorities respond quickly
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Connection Status */}
        <div className="mb-6 max-w-2xl mx-auto">
          {!online ? (
            <Alert variant="destructive">
              <WifiOff className="h-4 w-4" />
              <AlertDescription>
                You are offline. Reports will be saved locally and synced when connection is restored.
              </AlertDescription>
            </Alert>
          ) : pendingCount > 0 ? (
            <Alert className="bg-warning/10 border-warning">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <AlertDescription className="flex items-center justify-between">
                <span>
                  You have {pendingCount} pending report(s) waiting to be synced.
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={syncPendingReports}
                  disabled={syncing}
                >
                  {syncing ? (
                    <>
                      <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-3 w-3" />
                      Sync Now
                    </>
                  )}
                </Button>
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="bg-success/10 border-success">
              <Wifi className="h-4 w-4 text-success" />
              <AlertDescription>Connected and ready to submit reports</AlertDescription>
            </Alert>
          )}
        </div>

        {/* Report Form */}
        <ReportForm />

        {/* Info Section */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="bg-card rounded-lg p-6 border">
            <h2 className="text-xl font-semibold mb-4">How to Report</h2>
            <ol className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="font-bold text-primary">1.</span>
                <span>
                  Take a clear photo of the infrastructure damage
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-primary">2.</span>
                <span>
                  Allow location access so authorities know where the damage is located
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-primary">3.</span>
                <span>
                  Select the appropriate damage category and severity level
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-primary">4.</span>
                <span>
                  Provide a detailed description of the damage
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-primary">5.</span>
                <span>
                  Submit the report - it works even offline!
                </span>
              </li>
            </ol>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted mt-16 py-6 px-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2026 Post-Disaster Damage Assessment Platform</p>
          <p className="mt-2">Helping communities recover faster through citizen reporting</p>
        </div>
      </footer>
    </div>
  );
}
