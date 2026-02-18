-- Create reports table with spatial indexing
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('Low', 'Medium', 'High')),
  description TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  image_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Unverified' CHECK (status IN ('Unverified', 'Verified', 'In Progress', 'Resolved')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for fast spatial queries
CREATE INDEX IF NOT EXISTS idx_reports_latitude ON reports(latitude);
CREATE INDEX IF NOT EXISTS idx_reports_longitude ON reports(longitude);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);

-- Create composite index for bounding box queries
CREATE INDEX IF NOT EXISTS idx_reports_spatial ON reports(latitude, longitude);

-- Create storage bucket for damage images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'app-9pzqnj8eh1j5_damage_images',
  'app-9pzqnj8eh1j5_damage_images',
  true,
  1048576,
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: Allow anyone to upload and read images (no auth required)
CREATE POLICY "Allow public upload"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'app-9pzqnj8eh1j5_damage_images');

CREATE POLICY "Allow public read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'app-9pzqnj8eh1j5_damage_images');

-- Enable RLS on reports table
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert reports (citizen reporting)
CREATE POLICY "Allow public insert reports"
ON reports FOR INSERT
TO public
WITH CHECK (true);

-- Allow anyone to read reports (for map display)
CREATE POLICY "Allow public read reports"
ON reports FOR SELECT
TO public
USING (true);

-- Allow anyone to update report status (for authority dashboard)
CREATE POLICY "Allow public update reports"
ON reports FOR UPDATE
TO public
USING (true)
WITH CHECK (true);