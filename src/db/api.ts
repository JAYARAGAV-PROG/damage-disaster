import { supabase } from './supabase';
import type { Report, MapBounds } from '@/types/report';

/**
 * Fetch reports within geographic bounds
 */
export async function getReportsInBounds(bounds: MapBounds): Promise<Report[]> {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .gte('latitude', bounds.min_lat)
    .lte('latitude', bounds.max_lat)
    .gte('longitude', bounds.min_lng)
    .lte('longitude', bounds.max_lng)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }

  return Array.isArray(data) ? data : [];
}

/**
 * Create a new damage report
 */
export async function createReport(
  reportData: Omit<Report, 'id' | 'created_at' | 'status'>
): Promise<Report> {
  const { data, error } = await supabase
    .from('reports')
    .insert([reportData])
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error creating report:', error);
    throw error;
  }

  if (!data) {
    throw new Error('Failed to create report');
  }

  return data;
}

/**
 * Update report status
 */
export async function updateReportStatus(
  reportId: string,
  status: Report['status']
): Promise<Report> {
  const { data, error } = await supabase
    .from('reports')
    .update({ status })
    .eq('id', reportId)
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error updating report status:', error);
    throw error;
  }

  if (!data) {
    throw new Error('Failed to update report status');
  }

  return data;
}

/**
 * Get a single report by ID
 */
export async function getReportById(reportId: string): Promise<Report | null> {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('id', reportId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching report:', error);
    throw error;
  }

  return data;
}

/**
 * Subscribe to real-time report updates
 */
export function subscribeToReports(
  callback: (payload: { new: Report; old?: Report; eventType: string }) => void
) {
  const channel = supabase
    .channel('reports-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'reports'
      },
      (payload) => {
        callback({
          new: payload.new as Report,
          old: payload.old as Report,
          eventType: payload.eventType
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
