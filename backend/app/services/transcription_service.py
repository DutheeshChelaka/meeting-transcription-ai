import assemblyai as aai
import os
from typing import Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set AssemblyAI API key
aai.settings.api_key = os.getenv("ASSEMBLYAI_API_KEY")


class TranscriptionService:
    """
    Service for handling audio transcription using AssemblyAI
    """
    
    def __init__(self):
        """Initialize the transcription service"""
        self.api_key = os.getenv("ASSEMBLYAI_API_KEY")
        if not self.api_key:
            raise ValueError("ASSEMBLYAI_API_KEY not found in environment variables")
    
    async def transcribe_audio(
        self, 
        audio_file_path: str,
        language: Optional[str] = None
    ) -> dict:
        """
        Transcribe audio file using AssemblyAI
        
        Args:
            audio_file_path: Path to the audio file
            language: Optional language code (e.g., 'en', 'es', 'fr')
        
        Returns:
            Dictionary with transcript and metadata
        """
        try:
            # Configure transcription settings
            config = aai.TranscriptionConfig(
                language_code=language if language else None,
                speaker_labels=True  # Enable speaker diarization
            )
            
            # Create transcriber
            transcriber = aai.Transcriber(config=config)
            
            # Transcribe audio file
            transcript = transcriber.transcribe(audio_file_path)
            
            # Check if transcription was successful
            if transcript.status == aai.TranscriptStatus.error:
                return {
                    "success": False,
                    "error": transcript.error,
                    "transcript": None
                }
            
            # Return structured response
            return {
                "success": True,
                "transcript": transcript.text,
                "language": transcript.language_code if hasattr(transcript, 'language_code') else 'en',
                "confidence": transcript.confidence if hasattr(transcript, 'confidence') else None,
                "words": len(transcript.words) if transcript.words else 0,
                "audio_duration": transcript.audio_duration if hasattr(transcript, 'audio_duration') else None
            }
        
        except FileNotFoundError:
            return {
                "success": False,
                "error": "Audio file not found",
                "transcript": None
            }
        
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "transcript": None
            }
    
    async def get_supported_languages(self) -> list:
        """
        Return list of commonly supported languages
        
        Returns:
            List of language codes
        """
        return [
            "en",  # English
            "es",  # Spanish
            "fr",  # French
            "de",  # German
            "it",  # Italian
            "pt",  # Portuguese
            "nl",  # Dutch
            "hi",  # Hindi
            "ja",  # Japanese
            "zh",  # Chinese
            "ko",  # Korean
            "ru",  # Russian
            "ar",  # Arabic
            # AssemblyAI supports 99+ languages!
        ]