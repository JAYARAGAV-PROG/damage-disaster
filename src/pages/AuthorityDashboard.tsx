import { useState, useEffect, useMemo } from 'react';
import { MapView } from '@/components/MapView';
import { FilterPanel, type FilterState } from '@/components/FilterPanel';
import { ReportCard } from '@/components/ReportCard';
import { ReportDetailsDialog } from '@/components/ReportDetailsDialog';
import { getReportsInBounds, getAllReports } from '@/services/apiService';
import { authService } from '@/services/authService';
import { useNavigate } from 'react-router-dom';
import type { Report, MapBounds } from '@/types/report';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Map, List, LogOut, User } from 'lucide-react';
import { toast } from 'sonner';

export default function AuthorityDashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [bounds, setBounds] = useState<MapBounds | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    severity: 'All',
    status: 'All'
  });
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [view, setView] = useState<'map' | 'list'>('map');
  const navigate = useNavigate();
  const user = authService.getUser();

  // Fetch reports when bounds change
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        let data: Report[];
        if (bounds && view === 'map') {
          data = await getReportsInBounds(bounds);
        } else {
          data = await getAllReports();
        }
        setReports(data);
      } catch (error: any) {
        console.error('Error fetching reports:', error);
        toast.error(error.message || 'Failed to load reports');
      } finally {
        setLoading(false);
      }
    };

    if (bounds || view === 'list') {
      fetchReports();
    }
  }, [bounds, view]);

  // Refresh reports periodically (every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      if (bounds && view === 'map') {
        getReportsInBounds(bounds).then(setReports).catch(console.error);
      } else if (view === 'list') {
        getAllReports().then(setReports).catch(console.error);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [bounds, view]);

  // Apply filters
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      if (filters.category !== 'All' && report.category !== filters.category) {
        return false;
      }
      if (filters.severity !== 'All' && report.severity !== filters.severity) {
        return false;
      }
      if (filters.status !== 'All' && report.status !== filters.status) {
        return false;
      }
      return true;
    });
  }, [reports, filters]);

  const handleReportClick = (report: Report) => {
    setSelectedReport(report);
    setDialogOpen(true);
  };

  const handleStatusUpdate = () => {
    // Refresh reports after status update
    if (bounds && view === 'map') {
      getReportsInBounds(bounds).then(setReports);
    } else {
      getAllReports().then(setReports);
    }
  };

  const handleLogout = () => {
    authService.logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Statistics
  const stats = useMemo(() => {
    return {
      total: filteredReports.length,
      unverified: filteredReports.filter((r) => r.status === 'Unverified').length,
      inProgress: filteredReports.filter((r) => r.status === 'In Progress').length,
      resolved: filteredReports.filter((r) => r.status === 'Resolved').length,
      highSeverity: filteredReports.filter((r) => r.severity === 'High').length
    };
  }, [filteredReports]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-4 px-4 shadow-md">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Authority Dashboard</h1>
              <p className="text-sm opacity-90">
                Monitor and manage damage reports across India
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <Button
                  variant={view === 'map' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setView('map')}
                  className="text-primary-foreground hover:text-primary-foreground"
                >
                  <Map className="h-4 w-4 mr-2" />
                  Map View
                </Button>
                <Button
                  variant={view === 'list' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setView('list')}
                  className="text-primary-foreground hover:text-primary-foreground"
                >
                  <List className="h-4 w-4 mr-2" />
                  List View
                </Button>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" />
                <span>{user?.username}</span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Statistics Bar */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Total Reports</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-status-unverified">{stats.unverified}</div>
              <div className="text-xs text-muted-foreground">Unverified</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-status-in-progress">{stats.inProgress}</div>
              <div className="text-xs text-muted-foreground">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-status-resolved">{stats.resolved}</div>
              <div className="text-xs text-muted-foreground">Resolved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-severity-high">{stats.highSeverity}</div>
              <div className="text-xs text-muted-foreground">High Severity</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <FilterPanel onFilterChange={setFilters} />
          </div>

          {/* Map or List View */}
          <div className="lg:col-span-3">
            {view === 'map' ? (
              <div className="h-[calc(100vh-300px)] min-h-[500px]">
                {loading && !bounds ? (
                  <Skeleton className="w-full h-full bg-muted" />
                ) : (
                  <MapView
                    reports={filteredReports}
                    onBoundsChange={setBounds}
                    onReportClick={handleReportClick}
                    selectedReportId={selectedReport?.id}
                  />
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {loading ? (
                  <>
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-48 w-full bg-muted" />
                    ))}
                  </>
                ) : filteredReports.length === 0 ? (
                  <Alert>
                    <AlertDescription>
                      No reports found matching the current filters.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredReports.map((report) => (
                      <ReportCard
                        key={report.id}
                        report={report}
                        onClick={() => handleReportClick(report)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Report Details Dialog */}
      <ReportDetailsDialog
        report={selectedReport}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
}
