import os

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from app.middleware.auth import verify_clerk_user
from app.routes import ai, health

app = FastAPI(title="Tutor Ops API", version="0.1.0")

# Permissive by design for local dev (matches the original Express setup,
# which reflected any origin with credentials). Tighten on public deploy.
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(ai.router, dependencies=[Depends(verify_clerk_user)])

# Production SPA serving: when FRONTEND_DIST points at a built frontend
# (frontend/dist/public), serve it on the same port as the API so a
# single-port deployment works. Registered last, so /api/* and /healthz
# (above) always win. In dev FRONTEND_DIST is unset and this is skipped.
FRONTEND_DIST = os.getenv("FRONTEND_DIST", "")

if FRONTEND_DIST and os.path.isdir(FRONTEND_DIST):

    @app.get("/{path:path}")
    async def serve_frontend(path: str):
        candidate = os.path.normpath(os.path.join(FRONTEND_DIST, path))
        if path and candidate.startswith(FRONTEND_DIST) and os.path.isfile(candidate):
            return FileResponse(candidate)
        return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))
