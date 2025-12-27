import openai
import os
from typing import Optional
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

# Set OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")


class SummarizationService:
    """
    Service for generating AI-powered meeting summaries using OpenAI GPT
    """
    
    def __init__(self):
        """Initialize the summarization service"""
        self.api_key = os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("OPENAI_API_KEY not found in environment variables")
    
    async def generate_summary(self, transcript: str) -> dict:
        """
        Generate a structured summary from transcript
        
        Args:
            transcript: The meeting transcript text
        
        Returns:
            Dictionary with summary, key points, action items, and decisions
        """
        try:
            print("=" * 50)
            print("STARTING SUMMARIZATION WITH GPT-4...")
            print(f"Transcript length: {len(transcript)} characters")
            print("=" * 50)
            
            # Create the prompt for GPT
            prompt = f"""Analyze this meeting transcript and provide a structured summary.

Transcript:
{transcript}

Please provide:
1. Executive Summary (2-3 sentences)
2. Key Points (bullet points)
3. Action Items (with responsible parties if mentioned)
4. Decisions Made (if any)

Format your response as JSON with these keys:
- executive_summary
- key_points (array)
- action_items (array)
- decisions (array)

Respond ONLY with valid JSON, no markdown formatting."""

            print("Calling OpenAI GPT-4o-mini API...")
            
            # Call OpenAI API
            response = openai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert meeting analyst who creates clear, concise summaries. Always respond with valid JSON."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.7,
                max_tokens=1000
            )
            
            print("OpenAI API responded successfully!")
            
            # Extract the response
            summary_text = response.choices[0].message.content
            
            print(f"Response length: {len(summary_text)} characters")
            
            # Try to parse as JSON
            try:
                # Remove markdown code blocks if present
                if "```json" in summary_text:
                    summary_text = summary_text.split("```json")[1].split("```")[0].strip()
                elif "```" in summary_text:
                    summary_text = summary_text.split("```")[1].split("```")[0].strip()
                
                summary_data = json.loads(summary_text)
                print("JSON parsing successful!")
            except json.JSONDecodeError as je:
                print(f"JSON parsing failed: {str(je)}")
                print(f"Raw response: {summary_text[:200]}...")
                # If JSON parsing fails, return raw text
                summary_data = {
                    "executive_summary": summary_text,
                    "key_points": [],
                    "action_items": [],
                    "decisions": []
                }
            
            print("Returning successful summary")
            print("=" * 50)
            
            return {
                "success": True,
                "summary": summary_data.get("executive_summary", ""),
                "key_points": summary_data.get("key_points", []),
                "action_items": summary_data.get("action_items", []),
                "decisions": summary_data.get("decisions", []),
                "raw_response": summary_text
            }
        
        except Exception as e:
            print("=" * 50)
            print("SUMMARIZATION ERROR:")
            print(f"Error type: {type(e).__name__}")
            print(f"Error message: {str(e)}")
            print("=" * 50)
            import traceback
            traceback.print_exc()
            print("=" * 50)
            return {
                "success": False,
                "error": str(e),
                "summary": None
            }
    
    async def generate_quick_summary(self, transcript: str) -> dict:
        """
        Generate a quick one-paragraph summary
        
        Args:
            transcript: The meeting transcript text
        
        Returns:
            Dictionary with quick summary
        """
        try:
            print("Generating quick summary with GPT-4o-mini...")
            
            response = openai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a meeting summarizer. Create concise one-paragraph summaries."
                    },
                    {
                        "role": "user",
                        "content": f"Summarize this meeting transcript in one clear paragraph:\n\n{transcript}"
                    }
                ],
                temperature=0.7,
                max_tokens=200
            )
            
            summary = response.choices[0].message.content
            
            print("Quick summary generated successfully!")
            
            return {
                "success": True,
                "summary": summary
            }
        
        except Exception as e:
            print("=" * 50)
            print("QUICK SUMMARY ERROR:")
            print(f"Error type: {type(e).__name__}")
            print(f"Error message: {str(e)}")
            print("=" * 50)
            import traceback
            traceback.print_exc()
            print("=" * 50)
            return {
                "success": False,
                "error": str(e),
                "summary": None
            }