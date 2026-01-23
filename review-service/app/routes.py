# Rotas REST do serviço de reviews
# Todas as rotas usam FastAPI e são documentadas automaticamente

from fastapi import APIRouter, Depends, HTTPException
from .models import ReviewCreate, ReviewUpdate, ReviewOut
from .auth import get_current_user
from .service import ReviewService

router = APIRouter(prefix="/reviews", tags=["Reviews"])

@router.post("/", response_model=ReviewOut, summary="Create new review")
async def create_review(data: ReviewCreate, user=Depends(get_current_user)):
    created = await ReviewService.create(user_id=user["id"], data=data.dict())
    return created

@router.get("/game/{game_id}", summary="List reviews by game")
async def get_reviews_for_game(game_id: str):
    reviews = await ReviewService.get_all_for_game(game_id)
    return reviews

@router.get("/user/{user_id}", summary="List reviews by user")
async def get_reviews_for_user(user_id: str):
    reviews = await ReviewService.get_all_for_user(user_id)
    return reviews

@router.put("/{review_id}", summary="Update a review")
async def update_review(review_id: str, data: ReviewUpdate, user=Depends(get_current_user)):
    result = await ReviewService.update(review_id, user["id"], data.dict(exclude_none=True))
    if result is None:
        raise HTTPException(status_code=404, detail="Review not found")
    if result == "forbidden":
        raise HTTPException(status_code=403, detail="Not allowed to update this review")
    return result

@router.delete("/{review_id}", summary="Delete a review")
async def delete_review(review_id: str, user=Depends(get_current_user)):
    result = await ReviewService.delete(review_id, user["id"])
    if result is None:
        raise HTTPException(status_code=404, detail="Review not found")
    if result == "forbidden":
        raise HTTPException(status_code=403, detail="Not allowed to delete this review")
    return {"message": "Review deleted successfully"}
