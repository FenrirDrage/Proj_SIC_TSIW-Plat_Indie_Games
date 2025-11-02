# Define o modelo de dados e schemas de validação Pydantic

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ReviewBase(BaseModel):
    game_id: str = Field(..., description="ID of the game being reviewed")
    rating: int = Field(..., ge=1, le=5, description="Rating game 1 to 5")
    comment: Optional[str] = Field(None, description="Comment about the game")

class ReviewCreate(ReviewBase):
    pass

class ReviewUpdate(BaseModel):
    rating: Optional[int] = Field(None, ge=1, le=5)
    comment: Optional[str] = None

class ReviewOut(ReviewBase):
    id: str
    user_id: str
    created_at: datetime
