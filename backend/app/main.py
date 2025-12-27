from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
import sys
import io
from app.api.transcription import router as transcription_router
from app.api.summarization import router as summarization_router

# Force UTF-8 encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Load environment variables from .env file
load_dotenv()

# Create FastAPI application
app = FastAPI(
    title="Meeting Transcription API",
    description="AI-powered meeting transcription and summarization",
    version="1.0.0"
)

# Configure CORS (so frontend can connect)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Test endpoint - check if API is running
@app.get("/")
async def root():
    """
    Root endpoint - returns welcome message
    """
    return {
        "message": "Meeting Transcription API is running!",
        "status": "active",
        "version": "1.0.0"
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    """
    Health check endpoint - verify API is healthy
    """
    return {
        "status": "healthy",
        "environment": os.getenv("ENVIRONMENT", "development")
    }

# Include API routers
app.include_router(transcription_router)
app.include_router(summarization_router)
