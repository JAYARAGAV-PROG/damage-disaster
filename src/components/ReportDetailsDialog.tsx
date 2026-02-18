import { useState } from 'react';
import type { Report } from '@/types/report';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { StatusBadge, SeverityBadge } from '@/components/StatusBadge';
import { updateReportStatus } from '@/services/apiService';
import { toast } from 'sonner';
import { MapPin, Calendar, Loader2 } from 'lucide-react';

interface ReportDetailsDialogProps {
  report: Report | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusUpdate?: () => void;
}

const STATUSES: Report['status'][] = ['Unverified', 'Verified', 'In Progress', 'Resolved'];

export function ReportDetailsDialog({
  report,
  open,
  onOpenChange,
  onStatusUpdate
}: ReportDetailsDialogProps) {
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState<Report['status'] | null>(null);

  if (!report) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusUpdate = async () => {
    if (!newStatus || newStatus === report.status) return;

    setUpdating(true);
    try {
      await updateReportStatus(report.id, newStatus);
      toast.success('Report status updated successfully');
      onStatusUpdate?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{report.category}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image */}
          {report.image_url && report.image_url !== 'pending' && (
            <div className="w-full">
              <img
                src={report.image_url}
                alt={report.category}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Badges */}
          <div className="flex gap-2">
            <SeverityBadge severity={report.severity} />
            <StatusBadge status={report.status} />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <p className="text-sm text-foreground">{report.description}</p>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label>Location</Label>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>
                Latitude: {report.latitude.toFixed(6)}, Longitude: {report.longitude.toFixed(6)}
              </span>
            </div>
          </div>

          {/* Timestamp */}
          <div className="space-y-2">
            <Label>Reported On</Label>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{formatDate(report.created_at)}</span>
            </div>
          </div>

          {/* Status Update */}
          <div className="space-y-3 pt-4 border-t">
            <Label>Update Status</Label>
            <div className="flex gap-2">
              <Select
                value={newStatus || report.status}
                onValueChange={(value) => setNewStatus(value as Report['status'])}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleStatusUpdate}
                disabled={updating || !newStatus || newStatus === report.status}
              >
                {updating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update'
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
