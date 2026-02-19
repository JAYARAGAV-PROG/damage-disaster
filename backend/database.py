import sqlite3
from contextlib import contextmanager
from datetime import datetime
import os

DATABASE_PATH = os.path.join(os.path.dirname(__file__), 'disaster_reports.db')

def init_database():
    """Initialize SQLite database with required tables"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL CHECK(role IN ('user', 'admin')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create reports table with spatial indexing
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS reports (
            id TEXT PRIMARY KEY,
            user_id INTEGER NOT NULL,
            category TEXT NOT NULL,
            severity TEXT NOT NULL CHECK(severity IN ('Low', 'Medium', 'High')),
            description TEXT NOT NULL,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL,
            image_url TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'Unverified' CHECK(status IN ('Unverified', 'Verified', 'In Progress', 'Resolved')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ''')
    
    # Create indexes for fast queries
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_reports_latitude ON reports(latitude)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_reports_longitude ON reports(longitude)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id)')
    
    # Create default admin user (username: admin, password: admin123)
    # Password hash for 'admin123'
    from auth import get_password_hash

    admin_password_hash = get_password_hash("admin123")

    cursor.execute('''
    INSERT OR IGNORE INTO users (username, email, password_hash, role)
    VALUES ('admin', 'admin@disaster.gov.in', ?, 'admin')
    ''', (admin_password_hash,))

    
    conn.commit()
    conn.close()
    print(f"Database initialized at {DATABASE_PATH}")

@contextmanager
def get_db():
    """Context manager for database connections"""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

def get_user_by_username(username: str):
    """Get user by username"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
        return cursor.fetchone()

def get_user_by_email(email: str):
    """Get user by email"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
        return cursor.fetchone()

def create_user(username: str, email: str, password_hash: str, role: str = 'user'):
    """Create a new user"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO users (username, email, password_hash, role)
            VALUES (?, ?, ?, ?)
        ''', (username, email, password_hash, role))
        conn.commit()
        return cursor.lastrowid

def create_report(report_id: str, user_id: int, category: str, severity: str, 
                 description: str, latitude: float, longitude: float, image_url: str):
    """Create a new damage report"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO reports (id, user_id, category, severity, description, latitude, longitude, image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (report_id, user_id, category, severity, description, latitude, longitude, image_url))
        conn.commit()
        return report_id

def get_reports_in_bounds(min_lat: float, max_lat: float, min_lng: float, max_lng: float):
    """Get reports within geographic bounds"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            SELECT * FROM reports
            WHERE latitude BETWEEN ? AND ?
            AND longitude BETWEEN ? AND ?
            ORDER BY created_at DESC
        ''', (min_lat, max_lat, min_lng, max_lng))
        return [dict(row) for row in cursor.fetchall()]

def get_all_reports():
    """Get all reports"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM reports ORDER BY created_at DESC')
        return [dict(row) for row in cursor.fetchall()]

def get_user_reports(user_id: int):
    """Get reports by user"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM reports WHERE user_id = ? ORDER BY created_at DESC', (user_id,))
        return [dict(row) for row in cursor.fetchall()]

def update_report_status(report_id: str, status: str):
    """Update report status"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('UPDATE reports SET status = ? WHERE id = ?', (status, report_id))
        conn.commit()
        return cursor.rowcount > 0

def get_report_by_id(report_id: str):
    """Get report by ID"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM reports WHERE id = ?', (report_id,))
        row = cursor.fetchone()
        return dict(row) if row else None
