import openai
import os
from typing import Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")


class TranscriptionService:
    """
    Service for handling audio transcription using OpenAI Whisper API
    """
    
    def __init__(self):
        """Initialize the transcription service"""
        self.api_key = os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("OPENAI_API_KEY not found in environment variables")
    
    async def transcribe_audio(
        self, 
        audio_file_path: str,
        language: Optional[str] = None
    ) -> dict:
        """
        Transcribe audio file using OpenAI Whisper
        
        Args:
            audio_file_path: Path to the audio file
            language: Optional language code (e.g., 'en', 'si', 'ta')
        
        Returns:
            Dictionary with transcript and metadata
        """
        try:
            print("=" * 50)
            print("TRANSCRIBING WITH OPENAI WHISPER...")
            print(f"Audio file: {audio_file_path}")
            print("=" * 50)
            
            # Open and read the audio file
            with open(audio_file_path, "rb") as audio_file:
                # Call OpenAI Whisper API
                transcript = openai.audio.transcriptions.create(
                    model="whisper-1",
                    file=audio_file,
                    language=language,  # Optional: specify language
                    response_format="verbose_json"  # Get detailed response
                )
            
            print("Whisper transcription successful!")
            print(f"Language detected: {transcript.language}")
            print("=" * 50)
            
            # Return structured response
            return {
                "success": True,
                "transcript": transcript.text,
                "language": transcript.language,
                "duration": transcript.duration if hasattr(transcript, 'duration') else None,
                "segments": transcript.segments if hasattr(transcript, 'segments') else None
            }
        
        except FileNotFoundError:
            print("ERROR: Audio file not found")
            return {
                "success": False,
                "error": "Audio file not found",
                "transcript": None
            }
        
        except Exception as e:
            print("=" * 50)
            print("TRANSCRIPTION ERROR:")
            print(f"Error type: {type(e).__name__}")
            print(f"Error message: {str(e)}")
            print("=" * 50)
            import traceback
            traceback.print_exc()
            return {
                "success": False,
                "error": str(e),
                "transcript": None
            }
    
    async def get_supported_languages(self) -> list:
        """
        Return list of supported languages
        
        Returns:
            List of language codes
        """
        return [
            "en",  # English
            "si",  # Sinhala ✅ NOW SUPPORTED!
            "ta",  # Tamil ✅ NOW SUPPORTED!
            "es",  # Spanish
            "fr",  # French
            "de",  # German
            "zh",  # Chinese
            "ja",  # Japanese
            "ko",  # Korean
            # Whisper supports 99+ languages!
        ]