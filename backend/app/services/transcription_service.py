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
    
    async def fix_sinhala_encoding(self, text: str, detected_language: str) -> str:
        """
        Fix Sinhala/Tamil encoding issues using GPT-4
        
        Args:
            text: The incorrectly encoded text
            detected_language: The detected language code
        
        Returns:
            Properly encoded text
        """
        try:
            print("=" * 50)
            print("FIXING ENCODING WITH GPT-4...")
            print(f"Detected language: {detected_language}")
            print("=" * 50)
            
            response = openai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert in fixing text encoding issues. The user will provide text that appears in the wrong script (often Kannada characters) but was transcribed from Sinhala or Tamil audio. Convert the phonetically transcribed text back to proper Sinhala or Tamil script. Respond ONLY with the corrected text, nothing else."
                    },
                    {
                        "role": "user",
                        "content": f"This text was transcribed from {detected_language} audio but appears in wrong encoding. Fix it to proper {detected_language} script:\n\n{text}"
                    }
                ],
                temperature=0.3,
                max_tokens=1000
            )
            
            fixed_text = response.choices[0].message.content
            
            print("Encoding fixed successfully!")
            print("=" * 50)
            
            return fixed_text
        
        except Exception as e:
            print(f"Encoding fix failed: {str(e)}")
            # Return original text if fix fails
            return text
    
    async def transcribe_audio(
        self, 
        audio_file_path: str,
        language: Optional[str] = None
    ) -> dict:
        """
        Transcribe audio file using OpenAI Whisper
        
        Args:
            audio_file_path: Path to the audio file
            language: Optional language code (ignored for Sinhala/Tamil)
        
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
                # Call OpenAI Whisper API without language parameter
                # Let it auto-detect
                transcript = openai.audio.transcriptions.create(
                    model="whisper-1",
                    file=audio_file,
                    response_format="verbose_json"
                )
            
            detected_lang = transcript.language.upper()
            transcript_text = transcript.text
            
            print(f"Whisper transcription successful!")
            print(f"Language detected: {detected_lang}")
            print("=" * 50)
            
            # Fix encoding for Sinhala and Tamil
            if detected_lang in ['SINHALA', 'SI', 'TAMIL', 'TA']:
                print(f"Detected {detected_lang} - attempting encoding fix...")
                transcript_text = await self.fix_sinhala_encoding(
                    transcript_text, 
                    detected_lang
                )
            
            # Return structured response
            return {
                "success": True,
                "transcript": transcript_text,
                "language": detected_lang,
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
            "si",  # Sinhala (with encoding fix)
            "ta",  # Tamil (with encoding fix)
            "es",  # Spanish
            "fr",  # French
            "de",  # German
            "zh",  # Chinese
            "ja",  # Japanese
            "ko",  # Korean
            # Whisper supports 99+ languages!
        ]