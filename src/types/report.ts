export type ReportCategory = 'Flooding' | 'Road Blocked' | 'Potholes' | 'Building Damage' | 'Power Outage' | 'Water Supply Issue' | 'Other';

export type ReportSeverity = 'Low' | 'Medium' | 'High';

export type ReportStatus = 'Unverified' | 'Verified' | 'In Progress' | 'Resolved';

export interface Report {
  id: string;
  category: ReportCategory;
  severity: ReportSeverity;
  description: string;
  latitude: number;
  longitude: number;
  image_url: string;
  status: ReportStatus;
  created_at: string;
}

export interface ReportFormData {
  category: ReportCategory;
  severity: ReportSeverity;
  description: string;
  latitude: number;
  longitude: number;
  image: File;
}

export interface MapBounds {
  min_lat: number;
  max_lat: number;
  min_lng: number;
  max_lng: number;
}

export interface GeolocationCoords {
  latitude: number;
  longitude: number;
  accuracy: number;
}
