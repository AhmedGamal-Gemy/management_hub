import os

from litellm import acompletion

# AI calling via the litellm package (in-process library mode).
# No sidecar proxy container: the model is chosen by the LITELLM_MODEL
# env value (e.g. "groq/llama-3.3-70b-versatile"), so switching models
# stays config-only. See TECHNICAL_PLAN.md section 6.

LITELLM_MODEL = os.getenv("LITELLM_MODEL", "groq/llama-3.3-70b-versatile")


async def call_litellm(model: str, messages: list[dict]) -> str:
    # `model` is the logical name (e.g. "tutor-ops"); library mode
    # resolves it to the configured provider model string.
    _ = model
    response = await acompletion(
        model=LITELLM_MODEL,
        messages=messages,
        response_format={"type": "json_object"},
    )
    return response["choices"][0]["message"]["content"]
