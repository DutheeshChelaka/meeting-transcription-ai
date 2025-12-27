from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.summarization_service import SummarizationService

# Create API router
router = APIRouter(
    prefix="/api",
    tags=["summarization"]
)

# Initialize summarization service
summarization_service = SummarizationService()


# Request model
class SummarizeRequest(BaseModel):
    transcript: str
    quick: bool = False  # If True, generate quick summary only


@router.post("/summarize")
async def summarize_transcript(request: SummarizeRequest):
    """
    Generate AI summary from transcript
    
    Accepts:
    - transcript: The meeting transcript text
    - quick: Optional - generate quick summary (default: False)
    
    Returns:
    - Structured summary with key points, action items, decisions
    """
    
    if not request.transcript or len(request.transcript.strip()) == 0:
        raise HTTPException(
            status_code=400,
            detail="Transcript text is required"
        )
    
    try:
        # Generate appropriate summary type
        if request.quick:
            result = await summarization_service.generate_quick_summary(request.transcript)
        else:
            result = await summarization_service.generate_summary(request.transcript)
        
        if not result.get("success"):
            raise HTTPException(
                status_code=500,
                detail=result.get("error", "Summarization failed")
            )
        
        return result
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/summarization/health")
async def summarization_health():
    """
    Check if summarization service is ready
    """
    return {
        "status": "healthy",
        "service": "summarization",
        "model": "gpt-4o-mini"
    }