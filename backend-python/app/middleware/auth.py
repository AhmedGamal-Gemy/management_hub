import os
import time

import httpx
import jwt
from fastapi import HTTPException, Request

# Clerk session verification (mirrors the original Express app, which used
# getAuth(req).userId as the owner id on every query). The browser sends
# the Clerk session as the __session cookie on same-origin /api/* calls
# (Authorization: Bearer is accepted as a fallback). Returns the Clerk
# user id, which the CRUD backend will use as owner_id.

CLERK_JWKS_URL = os.getenv("CLERK_JWKS_URL", "")
_JWKS_TTL_SECONDS = 3600
_cache: dict = {"keys": {}, "fetched_at": 0.0}


def _signing_key(kid: str):
    now = time.time()
    if not _cache["keys"] or now - _cache["fetched_at"] > _JWKS_TTL_SECONDS:
        if not CLERK_JWKS_URL:
            raise HTTPException(status_code=401, detail="CLERK_JWKS_URL is not configured")
        response = httpx.get(CLERK_JWKS_URL, timeout=10)
        response.raise_for_status()
        _cache.update(
            keys={key["kid"]: key for key in response.json()["keys"]},
            fetched_at=now,
        )
    jwk = _cache["keys"].get(kid)
    if not jwk:
        raise HTTPException(status_code=401, detail="Unknown signing key")
    return jwt.algorithms.RSAAlgorithm.from_jwk(jwk)


async def verify_clerk_user(request: Request) -> str:
    token = None
    auth = request.headers.get("authorization", "")
    if auth.lower().startswith("bearer "):
        token = auth.split(" ", 1)[1].strip()
    elif request.cookies.get("__session"):
        token = request.cookies["__session"]
    if not token:
        raise HTTPException(status_code=401, detail="Missing session")
    try:
        kid = jwt.get_unverified_header(token)["kid"]
        payload = jwt.decode(
            token,
            _signing_key(kid),
            algorithms=["RS256"],
            options={"verify_aud": False},
        )
        return str(payload["sub"])
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid session")
