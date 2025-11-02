# Ponto de entrada do serviço Review

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import router as review_router
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="IndieHub - Review Service",
    description="Serviço de reviews e classificações do projeto IndieHub",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Rotas
app.include_router(review_router)

# Health check
@app.get("/")
async def root():
    return {"service": "review-service", "status": "ok"}

# Execução local (para testes fora do Docker)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=int(os.getenv("PORT", 4003)), reload=True)
