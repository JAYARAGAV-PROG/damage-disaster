import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGeolocation } from '@/hooks/useGeolocation';
import { createReport } from '@/db/api';
import { supabase } from '@/db/supabase';
import {
  compressImage,
  validateImageFile,
  formatFileSize
} from '@/lib/imageUtils';
import { savePendingReport, isOnline } from '@/lib/offlineStorage';
import type { ReportFormData, ReportCategory, ReportSeverity } from '@/types/report';
import { toast } from 'sonner';
import { MapPin, Upload, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const CATEGORIES: ReportCategory[] = [
  'Flooding',
  'Road Blocked',
  'Potholes',
  'Building Damage',
  'Power Outage',
  'Water Supply Issue',
  'Other'
];

const SEVERITIES: ReportSeverity[] = ['Low', 'Medium', 'High'];

export function ReportForm() {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<string | null>(null);
  const { coords, error: geoError, loading: geoLoading, getCurrentPosition } = useGeolocation();

  const form = useForm<ReportFormData>({
    defaultValues: {
      category: 'Potholes',
      severity: 'Medium',
      description: ''
    }
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    setCompressedSize(null);
  };

  const onSubmit = async (data: Omit<ReportFormData, 'image' | 'latitude' | 'longitude'>) => {
    if (!selectedImage) {
      toast.error('Please select an image');
      return;
    }

    if (!coords) {
      toast.error('Location not available. Please enable location services.');
      return;
    }

    setUploading(true);
    setUploadProgress(10);

    try {
      // Compress image
      setUploadProgress(20);
      const compressedImage = await compressImage(selectedImage);
      setCompressedSize(formatFileSize(compressedImage.size));
      
      if (compressedImage.size > 1048576) {
        toast.warning('Image compressed but still large. Upload may take longer.');
      }

      setUploadProgress(40);

      // Check if online
      if (!isOnline()) {
        // Save to IndexedDB for later sync
        const reportData = {
          category: data.category,
          severity: data.severity,
          description: data.description,
          latitude: coords.latitude,
          longitude: coords.longitude,
          image_url: 'pending' // Will be uploaded when online
        };

        await savePendingReport(reportData);
        toast.info('You are offline. Report saved and will be synced when online.');
        
        // Reset form
        form.reset();
        setSelectedImage(null);
        setImagePreview(null);
        setCompressedSize(null);
        setUploading(false);
        setUploadProgress(0);
        return;
      }

      // Upload image to Supabase Storage
      const fileName = `${Date.now()}_${compressedImage.name}`;
      const filePath = `damage-reports/${fileName}`;

      setUploadProgress(60);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('app-9pzqnj8eh1j5_damage_images')
        .upload(filePath, compressedImage, {
          contentType: compressedImage.type,
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      setUploadProgress(80);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('app-9pzqnj8eh1j5_damage_images')
        .getPublicUrl(filePath);

      // Create report
      const reportData = {
        category: data.category,
        severity: data.severity,
        description: data.description,
        latitude: coords.latitude,
        longitude: coords.longitude,
        image_url: urlData.publicUrl
      };

      await createReport(reportData);

      setUploadProgress(100);
      
      toast.success(
        compressedSize
          ? `Report submitted successfully! Image compressed to ${compressedSize}`
          : 'Report submitted successfully!'
      );

      // Reset form
      form.reset();
      setSelectedImage(null);
      setImagePreview(null);
      setCompressedSize(null);
      setUploadProgress(0);
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('Failed to submit report. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Report Infrastructure Damage</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Location Status */}
            <div className="space-y-2">
              <Label>Location</Label>
              {geoLoading ? (
                <Alert>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <AlertDescription>Getting your location...</AlertDescription>
                </Alert>
              ) : geoError ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {geoError}
                    <Button
                      type="button"
                      variant="link"
                      className="ml-2 p-0 h-auto"
                      onClick={getCurrentPosition}
                    >
                      Retry
                    </Button>
                  </AlertDescription>
                </Alert>
              ) : coords ? (
                <Alert className="bg-success/10 border-success">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <AlertDescription className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location captured: {coords.latitude.toFixed(6)}, {coords.longitude.toFixed(6)}
                  </AlertDescription>
                </Alert>
              ) : null}
            </div>

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Damage Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Severity */}
            <FormField
              control={form.control}
              name="severity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Severity Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SEVERITIES.map((severity) => (
                        <SelectItem key={severity} value={severity}>
                          {severity}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              rules={{ required: 'Description is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the damage in detail..."
                      className="min-h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image">Damage Photo</Label>
              <Input
                id="image"
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp,image/avif"
                onChange={handleImageChange}
                disabled={uploading}
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Upload Progress */}
            {uploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={uploading || !coords || !selectedImage}
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting Report...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Submit Report
                </>
              )}
            </Button>

            {!isOnline() && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You are offline. Reports will be saved locally and synced when connection is restored.
                </AlertDescription>
              </Alert>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
