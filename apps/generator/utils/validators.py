from typing import Optional
from pydantic import BaseModel, Field


class GenerationParams(BaseModel):
    prompt: str = Field(..., min_length=10, max_length=1000)
    max_tokens: Optional[int] = Field(default=2000, ge=100, le=4000)
    temperature: Optional[float] = Field(default=0.7, ge=0, le=1.0)
