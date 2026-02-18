from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class User(BaseModel):
    id: int
    username: str
    email: str
    role: str
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

class ReportCreate(BaseModel):
    category: str
    severity: str
    description: str
    latitude: float
    longitude: float

class ReportResponse(BaseModel):
    id: str
    user_id: int
    category: str
    severity: str
    description: str
    latitude: float
    longitude: float
    image_url: str
    status: str
    created_at: str

class ReportStatusUpdate(BaseModel):
    status: str
