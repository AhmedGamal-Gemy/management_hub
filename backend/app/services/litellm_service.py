import os

import httpx

# Dual-mode AI calling (see TECHNICAL_PLAN.md section 6):
# - Local docker: LITELLM_PROXY_URL is set, requests go to the sidecar
#   proxy container using its logical model names (e.g. "tutor-ops").
# - Replit: no sidecar can run, so LITELLM_PROXY_URL is unset and the
#   litellm package is called in-process with the provider model string
#   from LITELLM_MODEL (e.g. "groq/llama-3.3-70b-versatile").
# Either way the caller passes the logical name and gets text back.

LITELLM_URL = os.getenv("LITELLM_PROXY_URL", "")
LITELLM_KEY = os.getenv("LITELLM_API_KEY", "sk-litellm-proxy")
LITELLM_MODEL = os.getenv("LITELLM_MODEL", "groq/llama-3.3-70b-versatile")


async def call_litellm(model: str, messages: list[dict]) -> str:
    if LITELLM_URL:
        return await _call_proxy(model, messages)
    return await _call_library(messages)


async def _call_proxy(model: str, messages: list[dict]) -> str:
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


async def _call_library(messages: list[dict]) -> str:
    from litellm import acompletion

    response = await acompletion(
        model=LITELLM_MODEL,
        messages=messages,
        response_format={"type": "json_object"},
    )
    return response["choices"][0]["message"]["content"]
