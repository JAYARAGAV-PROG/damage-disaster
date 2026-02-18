# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

**Backend (Python):**
```bash
cd backend
pip install -r requirements.txt
```

**Frontend (Node.js):**
```bash
cd ..
pnpm install
```

### Step 2: Configure Cloudinary (Image Storage)

1. **Sign up** for free at: https://cloudinary.com/
2. **Get credentials** from your dashboard:
   - Cloud Name
   - API Key
   - API Secret
3. **Create `.env` file** in `backend/` directory:
   ```bash
   cd backend
   cp .env.example .env
   ```
4. **Edit `.env`** and add your credentials:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

### Step 3: Run the Application

**Option A: Use Startup Script (Recommended)**

Linux/Mac:
```bash
./start.sh
```

Windows:
```bash
start.bat
```

**Option B: Manual Start**

Terminal 1 (Backend):
```bash
cd backend
python main.py
```

Terminal 2 (Frontend):
```bash
pnpm run dev
```

### Step 4: Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### Step 5: Login

**Admin Account (Authority Dashboard):**
- Username: `admin`
- Password: `admin123`
- Access: Full dashboard with status management

**User Account (Citizen Reporting):**
- Click "Register" to create a new account
- Access: Report damage interface

## 📱 Quick Feature Test

### Test Citizen Reporting:
1. Register a new user account
2. Go to "Report Damage"
3. Allow location access
4. Upload a test image
5. Fill in category, severity, and description
6. Submit report

### Test Authority Dashboard:
1. Login as admin (admin/admin123)
2. View reports on the map
3. Click a marker to see details
4. Update report status
5. Use filters to sort reports

### Test Offline Mode:
1. Submit a report while online
2. Disconnect from internet
3. Submit another report (saved locally)
4. Reconnect to internet
5. Watch automatic sync

## 🐛 Troubleshooting

**Backend won't start:**
- Check Python version: `python --version` (need 3.8+)
- Install dependencies: `pip install -r requirements.txt`

**Frontend won't start:**
- Check Node version: `node --version` (need 18+)
- Install pnpm: `npm install -g pnpm`
- Install dependencies: `pnpm install`

**Image upload fails:**
- Verify Cloudinary credentials in `backend/.env`
- Check image size (max 10MB before compression)

**Map not loading:**
- Check internet connection (OpenStreetMap requires online)
- Clear browser cache

**CORS errors:**
- Ensure backend is running on port 8000
- Check browser console for specific errors

## 📚 Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Explore API docs at http://localhost:8000/docs
- Check [backend/README.md](backend/README.md) for API details
- Review [TODO.md](TODO.md) for implementation notes

## 🎯 Key URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:5173 | Main application |
| Backend API | http://localhost:8000 | REST API |
| API Docs (Swagger) | http://localhost:8000/docs | Interactive API documentation |
| API Docs (ReDoc) | http://localhost:8000/redoc | Alternative API documentation |

## 💡 Tips

- Use Chrome/Firefox for best experience
- Enable location services for automatic GPS capture
- Test offline mode by disabling network in DevTools
- Check browser console for debugging information
- Backend logs show all API requests

## ✅ Verification Checklist

- [ ] Backend running on port 8000
- [ ] Frontend running on port 5173
- [ ] Can access login page
- [ ] Can login as admin
- [ ] Can register new user
- [ ] Can submit damage report
- [ ] Can view reports on map
- [ ] Can update report status
- [ ] Offline sync works

Enjoy using the Post-Disaster Damage Assessment Platform! 🎉
