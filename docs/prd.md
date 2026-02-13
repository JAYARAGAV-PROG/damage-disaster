# Post-Disaster Damage Assessment Platform Requirements Document

## 1. Application Overview

### 1.1 Application Name
Post-Disaster Damage Assessment Platform

### 1.2 Application Description
A web application that enables citizens to report infrastructure damage using mobile devices by uploading images, location details, and descriptions. The system provides authorities with a centralized dashboard featuring a map-based interface for rapid damage assessment and prioritized response coordination across India.

## 2. Core Features

### 2.1 Citizen Reporting Module
- Image upload with automatic client-side compression (target: under 500KB)
- Automatic geolocation capture (latitude/longitude)
- Damage category selection (e.g., Flooding, Road Blocked, Potholes)
- Severity level selection (Low, Medium, High)
- Text description input for damage details
- Progressive Web App (PWA) functionality with offline support
- Offline report storage in browser IndexedDB with automatic sync when network restored

### 2.2 Authority Dashboard Module
- Centralized map-based dashboard using Leaflet.js with OpenStreetMap
- Real-time display of damage reports as map markers
- Debounced map queries (500ms delay after map movement stops)
- Bounding box filtering to load only visible reports
- Report details view with images, descriptions, and metadata
- Report status management (Unverified, Verified, In Progress, Resolved)
- Filter and search capabilities by category, severity, and status

### 2.3 Technical Implementation Requirements
- Backend: Python with FastAPI framework
- Database: SQLite with indexed latitude/longitude columns
- Frontend: React-based Progressive Web App
- Map Integration: Leaflet.js with OpenStreetMap (no API keys required)
- Image Storage: Cloudinary free tier for hosting and compression
- Image Compression: browser-image-compression library for client-side processing

## 3. Database Schema

### 3.1 Reports Table Structure
- id: TEXT (UUID, Primary Key)
- category: TEXT (e.g., Flooding, Road Blocked, Potholes)
- severity: TEXT (Low, Medium, High)
- description: TEXT
- latitude: REAL (Indexed for fast querying)
- longitude: REAL (Indexed for fast querying)
- image_url: TEXT (Cloudinary URL)
- status: TEXT (Default: Unverified)
- created_at: DATETIME (Default: CURRENT_TIMESTAMP)

## 4. API Endpoints

### 4.1 POST /api/reports
- Accepts form data: category, severity, description, latitude, longitude, image file
- Uploads image to Cloudinary
- Saves report data and image URL to SQLite database
- Returns created report record with generated UUID

### 4.2 GET /api/reports
- Accepts query parameters: min_lat, max_lat, min_lng, max_lng
- Returns filtered list of reports within specified geographic bounds
- Uses indexed latitude/longitude columns for fast querying

## 5. Performance Optimization

### 5.1 Network Efficiency
- Client-side image compression before upload
- Offline-first architecture with IndexedDB caching
- Debounced API calls to reduce server load
- Bounding box queries to minimize data transfer

### 5.2 Database Optimization
- Indexed latitude and longitude columns for spatial queries
- Simple SQL BETWEEN queries for geographic filtering
- Efficient query execution targeting millisecond response times

## 6. User Scenarios

### 6.1 Citizen Reporting Flow
1. Citizen encounters infrastructure damage (e.g., potholes causing traffic issues during rainy season)
2. Opens web application on mobile device
3. Takes photo of damage
4. Application automatically captures GPS location
5. Citizen selects damage category and severity
6. Adds brief description of the problem
7. Submits report (works offline, syncs when connected)
8. Receives confirmation of submission

### 6.2 Authority Assessment Flow
1. Authority logs into dashboard
2. Views map with all reported incidents across regions
3. Zooms/pans to specific areas of interest
4. System loads only visible reports using bounding box filtering
5. Clicks on map markers to view report details
6. Reviews images, descriptions, and severity levels
7. Updates report status and prioritizes response actions
8. Coordinates resource allocation based on centralized data

## 7. Geographic Coverage
The platform supports damage reporting across all regions of India, with users able to submit reports from any location within the country.