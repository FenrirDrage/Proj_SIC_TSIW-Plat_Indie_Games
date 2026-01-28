# Middleware para validação do token JWT através do Auth Service
# (semelhante à lógica que usamos no gateway e game service)

import os
import httpx
from fastapi import Header, HTTPException, Depends
from dotenv import load_dotenv

load_dotenv()
AUTH_URL = os.getenv("AUTH_URL", "http://localhost:4001")

async def get_current_user(authorization: str = Header(None)):
    """
    Valida o token JWT enviando pedido ao Auth Service
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token Invalid")
    token = authorization.split(" ")[1]

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.post(f"{AUTH_URL}/verify", headers={"Authorization": f"Bearer {token}"})
            if resp.status_code != 200:
                raise HTTPException(status_code=resp.status_code, detail="Token Invalid")
            data = resp.json()
            return data.get("user", data)
    except Exception:
        raise HTTPException(status_code=401, detail="Failed to validate token")
