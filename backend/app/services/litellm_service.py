import os

import httpx

LITELLM_URL = os.getenv("LITELLM_PROXY_URL", "http://localhost:4000")
LITELLM_KEY = os.getenv("LITELLM_API_KEY", "sk-litellm-proxy")


async def call_litellm(model: str, messages: list[dict]) -> str:
    # Day 17: POST to {LITELLM_URL}/v1/chat/completions with Bearer key.
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{LITELLM_URL}/v1/chat/completions",
            headers={"Authorization": f"Bearer {LITELLM_KEY}"},
            json={
                "model": model,
                "messages": messages,
                "response_format": {"type": "json_object"},
            },
        )
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]
