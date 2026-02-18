import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Report } from '@/types/report';
import { useDebounce } from '@/hooks/use-debounce';

// Fix for default marker icons in Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
  reports: Report[];
  onBoundsChange: (bounds: {
    min_lat: number;
    max_lat: number;
    min_lng: number;
    max_lng: number;
  }) => void;
  onReportClick: (report: Report) => void;
  selectedReportId?: string;
}

export function MapView({
  reports,
  onBoundsChange,
  onReportClick,
  selectedReportId
}: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mapReady, setMapReady] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Default center: India (approximate center)
    const map = L.map(containerRef.current).setView([20.5937, 78.9629], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    mapRef.current = map;
    setMapReady(true);

    // Initial bounds
    const bounds = map.getBounds();
    onBoundsChange({
      min_lat: bounds.getSouth(),
      max_lat: bounds.getNorth(),
      min_lng: bounds.getWest(),
      max_lng: bounds.getEast()
    });

    // Debounced bounds change handler
    let boundsTimeout: NodeJS.Timeout;
    const handleBoundsChange = () => {
      clearTimeout(boundsTimeout);
      boundsTimeout = setTimeout(() => {
        const newBounds = map.getBounds();
        onBoundsChange({
          min_lat: newBounds.getSouth(),
          max_lat: newBounds.getNorth(),
          min_lng: newBounds.getWest(),
          max_lng: newBounds.getEast()
        });
      }, 500);
    };

    map.on('moveend', handleBoundsChange);
    map.on('zoomend', handleBoundsChange);

    return () => {
      map.off('moveend', handleBoundsChange);
      map.off('zoomend', handleBoundsChange);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when reports change
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers
    reports.forEach((report) => {
      if (!mapRef.current) return;

      const markerColor = getMarkerColor(report.severity);
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${markerColor}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([report.latitude, report.longitude], {
        icon: customIcon
      })
        .addTo(mapRef.current)
        .bindPopup(
          `
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-weight: bold;">${report.category}</h3>
            <p style="margin: 4px 0; font-size: 12px;"><strong>Severity:</strong> ${report.severity}</p>
            <p style="margin: 4px 0; font-size: 12px;"><strong>Status:</strong> ${report.status}</p>
            <p style="margin: 4px 0; font-size: 12px;">${report.description.substring(0, 100)}${report.description.length > 100 ? '...' : ''}</p>
          </div>
        `
        )
        .on('click', () => {
          onReportClick(report);
        });

      markersRef.current.push(marker);
    });
  }, [reports, mapReady, onReportClick]);

  // Highlight selected report
  useEffect(() => {
    if (!mapRef.current || !selectedReportId) return;

    const selectedReport = reports.find((r) => r.id === selectedReportId);
    if (selectedReport) {
      mapRef.current.setView([selectedReport.latitude, selectedReport.longitude], 15);
    }
  }, [selectedReportId, reports]);

  const getMarkerColor = (severity: Report['severity']) => {
    switch (severity) {
      case 'High':
        return '#ef4444'; // red
      case 'Medium':
        return '#f59e0b'; // orange
      case 'Low':
        return '#22c55e'; // green
      default:
        return '#6b7280'; // gray
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full rounded-lg overflow-hidden border border-border"
      style={{ minHeight: '500px' }}
    />
  );
}
