import type { Report } from '@/types/report';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge, SeverityBadge } from '@/components/StatusBadge';
import { MapPin, Calendar } from 'lucide-react';

interface ReportCardProps {
  report: Report;
  onClick?: () => void;
}

export function ReportCard({ report, onClick }: ReportCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">{report.category}</CardTitle>
          <div className="flex gap-2">
            <SeverityBadge severity={report.severity} />
            <StatusBadge status={report.status} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {report.image_url && report.image_url !== 'pending' && (
          <img
            src={report.image_url}
            alt={report.category}
            className="w-full h-40 object-cover rounded-md"
          />
        )}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {report.description}
        </p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>
              {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(report.created_at)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
