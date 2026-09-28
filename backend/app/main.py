from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.middleware.auth import verify_supabase_token
from app.routes import ai, health

app = FastAPI(title="Tutor Ops AI API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(ai.router, dependencies=[Depends(verify_supabase_token)])
