from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/ai", tags=["ai"])


class SummarizeRequest(BaseModel):
    notes: str


class InsightRequest(BaseModel):
    data: dict


@router.post("/summarize-session")
async def summarize_session(req: SummarizeRequest):
    # Day 17: validate JWT (via router dependency), call LiteLLM proxy.
    return {"summary": {}}


@router.post("/financial-insight")
async def financial_insight(req: InsightRequest):
    # Day 18: validate JWT (via router dependency), call LiteLLM proxy.
    return {"insight": ""}
