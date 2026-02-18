from fastapi import FastAPI, File, UploadFile, Form, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import cloudinary
import cloudinary.uploader
from datetime import timedelta
import uuid
import os
from dotenv import load_dotenv

from models import (
    UserCreate, UserLogin, Token, ReportCreate, 
    ReportResponse, ReportStatusUpdate
)
from database import (
    init_database, create_user, get_user_by_username, 
    get_user_by_email, create_report, get_reports_in_bounds,
    get_all_reports, get_user_reports, update_report_status,
    get_report_by_id
)
from auth import (
    verify_password, get_password_hash, create_access_token,
    get_current_user, get_current_admin, ACCESS_TOKEN_EXPIRE_MINUTES
)

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="Post-Disaster Damage Assessment API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Cloudinary (using free tier)
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME", "demo"),
    api_key=os.getenv("CLOUDINARY_API_KEY", ""),
    api_secret=os.getenv("CLOUDINARY_API_SECRET", "")
)

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    init_database()
    print("✅ Database initialized")
    print("✅ Default admin user created (username: admin, password: admin123)")

@app.get("/")
async def root():
    return {
        "message": "Post-Disaster Damage Assessment API",
        "version": "1.0.0",
        "status": "running"
    }

# Authentication endpoints
@app.post("/api/auth/register", response_model=Token)
async def register(user: UserCreate):
    """Register a new user"""
    # Check if username exists
    if get_user_by_username(user.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Check if email exists
    if get_user_by_email(user.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user
    password_hash = get_password_hash(user.password)
    user_id = create_user(user.username, user.email, password_hash, role='user')
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "role": "user"},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "username": user.username,
            "email": user.email,
            "role": "user"
        }
    }

@app.post("/api/auth/login", response_model=Token)
async def login(credentials: UserLogin):
    """Login user"""
    user = get_user_by_username(credentials.username)
    
    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"], "role": user["role"]},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "username": user["username"],
            "email": user["email"],
            "role": user["role"]
        }
    }

@app.get("/api/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get current user info"""
    return {
        "id": current_user["id"],
        "username": current_user["username"],
        "email": current_user["email"],
        "role": current_user["role"]
    }

# Report endpoints
@app.post("/api/reports", response_model=ReportResponse)
async def create_damage_report(
    category: str = Form(...),
    severity: str = Form(...),
    description: str = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    image: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """Create a new damage report with image upload"""
    try:
        # Upload image to Cloudinary
        upload_result = cloudinary.uploader.upload(
            image.file,
            folder="disaster-reports",
            resource_type="image"
        )
        image_url = upload_result["secure_url"]
        
        # Create report in database
        report_id = str(uuid.uuid4())
        create_report(
            report_id=report_id,
            user_id=current_user["id"],
            category=category,
            severity=severity,
            description=description,
            latitude=latitude,
            longitude=longitude,
            image_url=image_url
        )
        
        # Get created report
        report = get_report_by_id(report_id)
        return report
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create report: {str(e)}"
        )

@app.get("/api/reports")
async def get_reports(
    min_lat: float = None,
    max_lat: float = None,
    min_lng: float = None,
    max_lng: float = None,
    current_user: dict = Depends(get_current_user)
):
    """Get reports within geographic bounds or all reports"""
    try:
        if all([min_lat, max_lat, min_lng, max_lng]):
            reports = get_reports_in_bounds(min_lat, max_lat, min_lng, max_lng)
        else:
            # Admin can see all reports, users see only their own
            if current_user["role"] == "admin":
                reports = get_all_reports()
            else:
                reports = get_user_reports(current_user["id"])
        
        return reports
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch reports: {str(e)}"
        )

@app.get("/api/reports/{report_id}")
async def get_report(
    report_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get a specific report"""
    report = get_report_by_id(report_id)
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    # Users can only see their own reports, admins can see all
    if current_user["role"] != "admin" and report["user_id"] != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    return report

@app.patch("/api/reports/{report_id}/status")
async def update_status(
    report_id: str,
    status_update: ReportStatusUpdate,
    current_user: dict = Depends(get_current_admin)
):
    """Update report status (admin only)"""
    success = update_report_status(report_id, status_update.status)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    report = get_report_by_id(report_id)
    return report

@app.get("/api/reports/stats/summary")
async def get_stats(current_user: dict = Depends(get_current_admin)):
    """Get report statistics (admin only)"""
    reports = get_all_reports()
    
    stats = {
        "total": len(reports),
        "unverified": len([r for r in reports if r["status"] == "Unverified"]),
        "verified": len([r for r in reports if r["status"] == "Verified"]),
        "in_progress": len([r for r in reports if r["status"] == "In Progress"]),
        "resolved": len([r for r in reports if r["status"] == "Resolved"]),
        "high_severity": len([r for r in reports if r["severity"] == "High"]),
        "medium_severity": len([r for r in reports if r["severity"] == "Medium"]),
        "low_severity": len([r for r in reports if r["severity"] == "Low"])
    }
    
    return stats

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
