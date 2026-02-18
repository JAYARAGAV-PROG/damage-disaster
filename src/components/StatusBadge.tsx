import type { ReportStatus, ReportSeverity } from '@/types/report';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: ReportStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusColor = (status: ReportStatus) => {
    switch (status) {
      case 'Unverified':
        return 'bg-status-unverified text-foreground';
      case 'Verified':
        return 'bg-status-verified text-white';
      case 'In Progress':
        return 'bg-status-in-progress text-white';
      case 'Resolved':
        return 'bg-status-resolved text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Badge className={getStatusColor(status)} variant="secondary">
      {status}
    </Badge>
  );
}

interface SeverityBadgeProps {
  severity: ReportSeverity;
}

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  const getSeverityColor = (severity: ReportSeverity) => {
    switch (severity) {
      case 'Low':
        return 'bg-severity-low text-white';
      case 'Medium':
        return 'bg-severity-medium text-white';
      case 'High':
        return 'bg-severity-high text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Badge className={getSeverityColor(severity)} variant="secondary">
      {severity}
    </Badge>
  );
}
