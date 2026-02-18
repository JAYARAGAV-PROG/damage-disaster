# Post-Disaster Damage Assessment Platform Requirements Document

## 1. Application Overview

### 1.1 Application Name
Post-Disaster Damage Assessment Platform

### 1.2 Application Description
A full-stack web application that enables citizens to report infrastructure damage using mobile devices by uploading images, location details, and descriptions. The system provides authorities with a centralized dashboard featuring a map-based interface for rapid damage assessment and prioritized response coordination across India. The application includes separate user and admin authentication systems with role-based access control.

## 2. Core Features

### 2.1 Authentication System
- Separate login pages for User and Admin roles
- User login page for citizens to access reporting functionality
- Admin login page for authorities to access dashboard
- Role-based access control to restrict features by user type
- Session management for authenticated users

### 2.2 Citizen Reporting Module
- Image upload with automatic client-side compression (target: under 500KB)
- Automatic geolocation capture (latitude/longitude)
- Damage category selection (e.g., Flooding, Road Blocked, Potholes)
- Severity level selection (Low, Medium, High)
- Text description input for damage details
- Progressive Web App (PWA) functionality with offline support
- Offline report storage in browser IndexedDB with automatic sync when network restored
- Instant database save upon report submission when online

### 2.3 Authority Dashboard Module
- Centralized map-based dashboard using Leaflet.js with OpenStreetMap
- Real-time display of damage reports as map markers
- Debounced map queries (500ms delay after map movement stops)
- Bounding box filtering to load only visible reports
- Report details view with images, descriptions, and metadata
- Report status management (Unverified, Verified, In Progress, Resolved)
- Filter and search capabilities by category, severity, and status

### 2.4 Technical Implementation Requirements
- Backend: TypeScript with Node.js and Express framework
- Database: SQLite with indexed latitude/longitude columns
- Frontend: React-based Progressive Web App
- Map Integration: Leaflet.js with OpenStreetMap (no API keys required)
- Image Storage: Cloudinary free tier for hosting and compression
- Image Compression: browser-image-compression library for client-side processing
- Full-stack architecture with both frontend and backend services running simultaneously

## 3. Database Schema

### 3.1 Users Table Structure
- id: TEXT (UUID, Primary Key)
- username: TEXT (Unique)
- password: TEXT (Hashed)
- role: TEXT (User or Admin)
- created_at: DATETIME (Default: CURRENT_TIMESTAMP)

### 3.2 Reports Table Structure
- id: TEXT (UUID, Primary Key)
- user_id: TEXT (Foreign Key to Users table)
- category: TEXT (e.g., Flooding, Road Blocked, Potholes)
- severity: TEXT (Low, Medium, High)
- description: TEXT
- latitude: REAL (Indexed for fast querying)
- longitude: REAL (Indexed for fast querying)
- image_url: TEXT (Cloudinary URL)
- status: TEXT (Default: Unverified)
- created_at: DATETIME (Default: CURRENT_TIMESTAMP)

## 4. API Endpoints

### 4.1 POST /api/auth/login
- Accepts JSON: username, password, role
- Validates credentials against Users table
- Returns authentication token and user role

### 4.2 POST /api/reports
- Accepts form data: category, severity, description, latitude, longitude, image file
- Uploads image to Cloudinary
- Saves report data and image URL to SQLite database instantly
- Returns created report record with generated UUID

### 4.3 GET /api/reports
- Accepts query parameters: min_lat, max_lat, min_lng, max_lng
- Returns filtered list of reports within specified geographic bounds
- Uses indexed latitude/longitude columns for fast querying

### 4.4 PATCH /api/reports/:id
- Accepts JSON: status
- Updates report status in database
- Returns updated report record

## 5. Performance Optimization

### 5.1 Network Efficiency
- Client-side image compression before upload
- Offline-first architecture with IndexedDB caching
- Automatic sync of offline reports when network connection restored
- Debounced API calls to reduce server load
- Bounding box queries to minimize data transfer

### 5.2 Database Optimization
- Indexed latitude and longitude columns for spatial queries
- Simple SQL BETWEEN queries for geographic filtering
- Efficient query execution targeting millisecond response times
- Instant write operations for real-time data persistence

## 6. User Scenarios

### 6.1 User Authentication Flow
1. User opens application homepage
2. Selects User Login or Admin Login option
3. Enters credentials (username and password)
4. System validates credentials and role
5. Redirects to appropriate interface based on role

### 6.2 Citizen Reporting Flow
1. Citizen logs in through User Login page
2. Encounters infrastructure damage (e.g., potholes causing traffic issues during rainy season)
3. Takes photo of damage within the application
4. Application automatically captures GPS location
5. Citizen selects damage category and severity
6. Adds brief description of the problem
7. Submits report
8. If online: Report instantly saved to database and confirmation displayed
9. If offline: Report stored in IndexedDB and automatically synced when connection restored

### 6.3 Authority Assessment Flow
1. Authority logs in through Admin Login page
2. Views map-based dashboard with all reported incidents across regions
3. Zooms/pans to specific areas of interest
4. System loads only visible reports using bounding box filtering
5. Clicks on map markers to view report details
6. Reviews images, descriptions, and severity levels
7. Updates report status and prioritizes response actions
8. Coordinates resource allocation based on centralized data

## 7. Geographic Coverage
The platform supports damage reporting across all regions of India, with users able to submit reports from any location within the country.

## 8. Deployment Requirements
- Backend service must be running on specified port
- Frontend service must be running on specified port
- Both services must be operational for full application functionality
- Database file must be accessible to backend service
- Environment variables configured for Cloudinary integration