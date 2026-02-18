import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { useEffect } from 'react';
import { AlertTriangle, Shield, MapPin, Camera } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (authService.isAuthenticated()) {
      if (authService.isAdmin()) {
        navigate('/dashboard');
      } else {
        navigate('/report');
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-6">
            <AlertTriangle className="h-16 w-16" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Post-Disaster Damage Assessment Platform
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Empowering citizens to report infrastructure damage and enabling authorities
            to respond quickly and effectively across India
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/login')}
              className="text-lg"
            >
              <Camera className="mr-2 h-5 w-5" />
              Report Damage
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/login')}
              className="text-lg bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <Shield className="mr-2 h-5 w-5" />
              Authority Dashboard
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Camera className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-center">Citizen Reporting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">
                  Citizens can easily report infrastructure damage by uploading photos,
                  location details, and descriptions using their mobile devices.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <MapPin className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-center">Real-time Mapping</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">
                  All reports are displayed on an interactive map with automatic geolocation,
                  making it easy to visualize damage across regions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Shield className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-center">Authority Response</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">
                  Authorities can monitor, verify, and prioritize reports through a
                  centralized dashboard for rapid response coordination.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-muted py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Offline Support</h3>
                <p className="text-sm text-muted-foreground">
                  Reports are saved locally when offline and automatically synced when connection is restored
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Image Compression</h3>
                <p className="text-sm text-muted-foreground">
                  Automatic client-side image compression ensures fast uploads even on slow connections
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Automatic Geolocation</h3>
                <p className="text-sm text-muted-foreground">
                  GPS coordinates are captured automatically to pinpoint exact damage locations
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Real-time Updates</h3>
                <p className="text-sm text-muted-foreground">
                  Dashboard updates in real-time as new reports come in from across the country
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Status Management</h3>
                <p className="text-sm text-muted-foreground">
                  Track report progress from unverified to verified, in progress, and resolved
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Advanced Filtering</h3>
                <p className="text-sm text-muted-foreground">
                  Filter reports by category, severity, and status for efficient prioritization
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of citizens helping their communities recover faster by reporting
            infrastructure damage in real-time.
          </p>
          <Button size="lg" onClick={() => navigate('/login')}>
            <Camera className="mr-2 h-5 w-5" />
            Start Reporting Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-6 px-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2026 Post-Disaster Damage Assessment Platform</p>
          <p className="mt-2">Helping communities recover faster through citizen reporting</p>
        </div>
      </footer>
    </div>
  );
}
