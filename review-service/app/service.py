# Lógica de negócio das reviews
# CRUD completo sobre MongoDB

from datetime import datetime
from bson import ObjectId
from .database import reviews_collection
import json
import pika
import os

def to_dict(review):
    """Converte o documento Mongo em dicionário serializável"""
    review["_id"] = str(review["_id"])
    return {
        "id": review["_id"],
        "game_id": review["game_id"],
        "user_id": review["user_id"],
        "rating": review["rating"],
        "comment": review.get("comment"),
        "created_at": review["created_at"]
    }

class ReviewService:
    @staticmethod
    async def create(user_id: str, data: dict):
        doc = {
            "game_id": data["game_id"],
            "user_id": user_id,
            "rating": data["rating"],
            "comment": data.get("comment"),
            "created_at": datetime.utcnow()
        }
        res = await reviews_collection.insert_one(doc)
        doc["_id"] = res.inserted_id
        return to_dict(doc)

    @staticmethod
    async def get_all_for_game(game_id: str):
        cursor = reviews_collection.find({"game_id": game_id})
        results = [to_dict(r) async for r in cursor]
        return results

    @staticmethod
    async def get_all_for_user(user_id: str):
        cursor = reviews_collection.find({"user_id": user_id})
        results = [to_dict(r) async for r in cursor]
        return results

    @staticmethod
    async def update(review_id: str, user_id: str, data: dict):
        existing = await reviews_collection.find_one({"_id": ObjectId(review_id)})
        if not existing:
            return None
        if existing["user_id"] != user_id:
            return "forbidden"

        await reviews_collection.update_one(
            {"_id": ObjectId(review_id)},
            {"$set": {**data, "updated_at": datetime.utcnow()}}
        )
        updated = await reviews_collection.find_one({"_id": ObjectId(review_id)})
        return to_dict(updated)

    @staticmethod
    async def delete(review_id: str, user_id: str):
        existing = await reviews_collection.find_one({"_id": ObjectId(review_id)})
        if not existing:
            return None
        if existing["user_id"] != user_id:
            return "forbidden"
        await reviews_collection.delete_one({"_id": ObjectId(review_id)})
        return True

def publish_review_created(review: dict):
    """
    Publica evento de criação de review no RabbitMQ.
    Comunicação assíncrona (fire-and-forget).
    """
    rabbitmq_host = os.getenv("RABBITMQ_HOST", "rabbitmq")

    connection = pika.BlockingConnection(
        pika.ConnectionParameters(host=rabbitmq_host)
    )

    channel = connection.channel()
    channel.queue_declare(queue="review_events", durable=False)

    channel.basic_publish(
        exchange="",
        routing_key="review_events",
        body=json.dumps(review)
    )

    connection.close()