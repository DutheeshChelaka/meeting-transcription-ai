from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.transcription_service import TranscriptionService
import os
import tempfile
from pathlib import Path

# Create API router
router = APIRouter(
    prefix="/api",
    tags=["transcription"]
)

# Initialize transcription service
transcription_service = TranscriptionService()


@router.post("/transcribe")
async def transcribe_audio(
    file: UploadFile = File(..., description="Audio file to transcribe")
):
    """
    Upload and transcribe an audio file
    
    Accepts: MP3, WAV, M4A, WEBM, MP4
    Returns: Transcript text and metadata
    """
    
    # Validate file type
    allowed_types = ["audio/mpeg", "audio/wav", "audio/mp4", "audio/webm", "audio/x-m4a"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: MP3, WAV, M4A, WEBM, MP4"
        )
    
    # Create temporary file to store upload
    temp_file = None
    try:
        # Read uploaded file
        audio_data = await file.read()
        
        # Get file extension
        file_extension = Path(file.filename).suffix
        
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as temp_file:
            temp_file.write(audio_data)
            temp_file_path = temp_file.name
        
        # Transcribe using service
        result = await transcription_service.transcribe_audio(temp_file_path)
        
        # Clean up temporary file
        os.unlink(temp_file_path)
        
        return result
    
    except Exception as e:
        # Clean up temp file if exists
        if temp_file and os.path.exists(temp_file_path):
            os.unlink(temp_file_path)
        
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/supported-languages")
async def get_supported_languages():
    """
    Get list of supported languages for transcription
    """
    languages = await transcription_service.get_supported_languages()
    return {
        "success": True,
        "languages": languages
    }