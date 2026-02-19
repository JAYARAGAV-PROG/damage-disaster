# Welcome to Your Miaoda Project
Miaoda Application Link URL
    URL:https://medo.dev/projects/app-9pzqnj8eh1j5

# Post-Disaster Damage Assessment Platform

A full-stack web application that enables citizens to report infrastructure damage using mobile devices and provides authorities with a centralized map-based dashboard for rapid response coordination across India.

## 🌟 Features

### Citizen Features
- **User Registration & Login**: Secure authentication system
- **Damage Reporting**: Upload photos with automatic geolocation
- **Image Compression**: Automatic client-side compression (target: under 1MB)
- **Offline Support**: Reports saved locally and synced when online
- **Category Selection**: Flooding, Road Blocked, Potholes, Building Damage, Power Outage, Water Supply Issue, Other
- **Severity Levels**: Low, Medium, High

### Authority Features (Admin Only)
- **Interactive Map Dashboard**: Leaflet.js with OpenStreetMap
- **Real-time Updates**: Automatic refresh every 30 seconds
- **Geographic Filtering**: Bounding box queries for visible area
- **Status Management**: Update reports (Unverified → Verified → In Progress → Resolved)
- **Advanced Filtering**: By category, severity, and status
- **Statistics Dashboard**: Real-time metrics and counts

## 🏗️ Technology Stack

### Backend
- **Framework**: Python FastAPI
- **Database**: SQLite with spatial indexing
- **Image Storage**: Cloudinary (free tier)
- **Authentication**: JWT tokens with bcrypt password hashing
- **API Documentation**: Auto-generated Swagger UI

### Frontend
- **Framework**: React 18 with TypeScript
- **UI Library**: shadcn/ui + Tailwind CSS
- **Map Integration**: Leaflet.js with OpenStreetMap
- **State Management**: React Context + Hooks
- **Offline Storage**: IndexedDB
- **Build Tool**: Vite

## 📋 Prerequisites

- **Python**: 3.8 or higher
- **Node.js**: 18 or higher
- **pnpm**: Latest version
- **Cloudinary Account**: Free tier (for image storage)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
cd /workspace/app-9pzqnj8eh1j5
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Configure Cloudinary
cp .env.example .env
# Edit .env and add your Cloudinary credentials:
# CLOUDINARY_CLOUD_NAME=your_cloud_name
# CLOUDINARY_API_KEY=your_api_key
# CLOUDINARY_API_SECRET=your_api_secret
```

**Get Cloudinary Credentials:**
1. Sign up at https://cloudinary.com/ (free tier)
2. Go to Dashboard
3. Copy Cloud Name, API Key, and API Secret
4. Paste into `.env` file

### 3. Frontend Setup

```bash
# Navigate back to root directory
cd ..

# Install frontend dependencies
pnpm install
```

## 🎯 Running the Application

### Start Backend Server

```bash
# From backend directory
cd backend
python main.py
```

Backend will run on: **http://localhost:8000**
- API Documentation: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Start Frontend Development Server

```bash
# From root directory (in a new terminal)
pnpm run dev
```

Frontend will run on: **http://localhost:5173**

## 👥 Default Credentials

### Admin Account
- **Username**: `admin`
- **Password**: `admin123`
- **Access**: Authority Dashboard with full permissions

### User Account
- Register a new account at `/register`
- **Access**: Citizen reporting interface

## 📱 Usage Guide

### For Citizens (Users)

1. **Register/Login**: Create an account or login at `/login`
2. **Report Damage**:
   - Navigate to `/report`
   - Allow location access
   - Take/upload a photo of the damage
   - Select category and severity
   - Add description
   - Submit report
3. **Offline Mode**: Reports are saved locally and automatically synced when connection is restored

### For Authorities (Admins)

1. **Login**: Use admin credentials at `/login`
2. **View Dashboard**: Automatically redirected to `/dashboard`
3. **Map View**:
   - Pan and zoom to explore reports
   - Click markers to view details
   - Color-coded by severity (Red=High, Orange=Medium, Green=Low)
4. **List View**: Switch to see all reports in a grid
5. **Filter Reports**: Use sidebar to filter by category, severity, or status
6. **Update Status**: Click on any report to update its status

## 🗄️ Database Schema

### Users Table
```sql
- id: INTEGER (Primary Key)
- username: TEXT (Unique)
- email: TEXT (Unique)
- password_hash: TEXT
- role: TEXT (user/admin)
- created_at: TIMESTAMP
```

### Reports Table
```sql
- id: TEXT (UUID, Primary Key)
- user_id: INTEGER (Foreign Key)
- category: TEXT
- severity: TEXT (Low/Medium/High)
- description: TEXT
- latitude: REAL (Indexed)
- longitude: REAL (Indexed)
- image_url: TEXT
- status: TEXT (Unverified/Verified/In Progress/Resolved)
- created_at: TIMESTAMP
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Reports
- `POST /api/reports` - Create damage report (with image upload)
- `GET /api/reports` - Get reports (with optional geographic bounds)
- `GET /api/reports/{id}` - Get specific report
- `PATCH /api/reports/{id}/status` - Update report status (admin only)
- `GET /api/reports/stats/summary` - Get statistics (admin only)

## 🌐 Offline Support

The application includes robust offline functionality:

1. **Offline Detection**: Automatic detection of network status
2. **Local Storage**: Reports saved to IndexedDB when offline
3. **Automatic Sync**: Pending reports automatically uploaded when connection restored
4. **Manual Sync**: Users can manually trigger sync
5. **Sync Status**: Visual indicators show pending report count

## 🎨 Design System

- **Primary Color**: Orange (#f97316) - Emergency/Alert theme
- **Secondary Color**: Blue (#3b82f6) - Information/Trust
- **Status Colors**:
  - Unverified: Yellow
  - Verified: Blue
  - In Progress: Orange
  - Resolved: Green
- **Severity Colors**:
  - Low: Green
  - Medium: Orange
  - High: Red

## 🔒 Security Features

- JWT-based authentication
- Bcrypt password hashing
- Role-based access control (User/Admin)
- Protected API endpoints
- CORS configuration
- Input validation

## 📊 Performance Optimizations

- **Database**: Spatial indexing on latitude/longitude
- **Images**: Client-side compression before upload
- **Map**: Debounced queries (500ms) and bounding box filtering
- **API**: Efficient SQL queries with proper indexing
- **Frontend**: Code splitting and lazy loading

## 🐛 Troubleshooting

### Backend Issues

**Database not initializing:**
```bash
# Delete existing database and restart
rm backend/disaster_reports.db
python backend/main.py
```

**Cloudinary upload failing:**
- Verify credentials in `.env`
- Check free tier limits (25 credits/month)
- Ensure image size is under 10MB

### Frontend Issues

**CORS errors:**
- Ensure backend is running on port 8000
- Check CORS configuration in `backend/main.py`

**Map not loading:**
- Check internet connection (OpenStreetMap requires online access)
- Verify Leaflet CSS is imported in `main.tsx`

**Offline sync not working:**
- Check browser IndexedDB support
- Clear browser cache and try again

## 📝 Development Notes

### Adding New Damage Categories

1. Update `ReportCategory` type in `src/types/report.ts`
2. Add to `CATEGORIES` array in `src/components/ReportForm.tsx`
3. Update `FilterPanel.tsx` if needed

### Modifying Status Workflow

1. Update `ReportStatus` type in `src/types/report.ts`
2. Modify database CHECK constraint in `backend/database.py`
3. Update `STATUSES` array in components

## 📄 License

© 2026 Post-Disaster Damage Assessment Platform

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation at `/docs`
3. Check browser console for errors
4. Verify backend logs

## 🎯 Future Enhancements

- Push notifications for new reports
- SMS alerts for high-severity incidents
- Export reports to PDF/Excel
- Multi-language support
- Mobile native apps (iOS/Android)
- Advanced analytics dashboard
- Integration with government emergency systems
