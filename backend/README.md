# Post-Disaster Damage Assessment Platform - Backend

## Setup Instructions

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Cloudinary

1. Sign up for a free Cloudinary account at https://cloudinary.com/
2. Get your Cloud Name, API Key, and API Secret from the dashboard
3. Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

4. Edit `.env` and add your Cloudinary credentials

### 3. Run the Backend Server

```bash
python main.py
```

The API will be available at `http://localhost:8000`

### 4. Default Admin Credentials

- **Username**: admin
- **Password**: admin123

### API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

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

## Database

The application uses SQLite database (`disaster_reports.db`) which is automatically created on first run.

### Tables:
- `users` - User accounts (user/admin roles)
- `reports` - Damage reports with spatial indexing
