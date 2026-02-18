import { authService } from './authService';
import type { Report, MapBounds } from '@/types/report';

const API_BASE_URL = 'http://localhost:8000';

/**
 * Create a new damage report with image upload
 */
export async function createReportWithImage(
  formData: FormData
): Promise<Report> {
  const token = authService.getToken();
  
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/api/reports`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to create report');
  }

  return response.json();
}

/**
 * Get reports within geographic bounds
 */
export async function getReportsInBounds(bounds: MapBounds): Promise<Report[]> {
  const token = authService.getToken();
  
  if (!token) {
    throw new Error('Authentication required');
  }

  const params = new URLSearchParams({
    min_lat: bounds.min_lat.toString(),
    max_lat: bounds.max_lat.toString(),
    min_lng: bounds.min_lng.toString(),
    max_lng: bounds.max_lng.toString()
  });

  const response = await fetch(`${API_BASE_URL}/api/reports?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch reports');
  }

  return response.json();
}

/**
 * Get all reports (admin) or user's reports
 */
export async function getAllReports(): Promise<Report[]> {
  const token = authService.getToken();
  
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/api/reports`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch reports');
  }

  return response.json();
}

/**
 * Update report status (admin only)
 */
export async function updateReportStatus(
  reportId: string,
  status: Report['status']
): Promise<Report> {
  const token = authService.getToken();
  
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/api/reports/${reportId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update status');
  }

  return response.json();
}

/**
 * Get report statistics (admin only)
 */
export async function getReportStats(): Promise<{
  total: number;
  unverified: number;
  verified: number;
  in_progress: number;
  resolved: number;
  high_severity: number;
  medium_severity: number;
  low_severity: number;
}> {
  const token = authService.getToken();
  
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/api/reports/stats/summary`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch statistics');
  }

  return response.json();
}
