"""Async client for Mistral's API with full streaming and chat completion support."""
import logging
from dataclasses import dataclass
from types import SimpleNamespace
from typing import Any, AsyncIterator, Optional, List, Union
from openai import AsyncOpenAI

try:
    from mistralai import Mistral
except Exception:
    try:
        from mistralai.client import Mistral
    except Exception:
        Mistral = None

logger = logging.getLogger(__name__)


class MistralClientError(Exception):
    pass


@dataclass
class MistralConfig:
    temperature: float = 0.5
    max_output_tokens: int = 2500
    top_p: float = 0.9
    top_k: int = 40
    response_mime_type: Optional[str] = None
    system_instruction: Optional[str] = None


class MistralPart:
    @staticmethod
    def from_uri(file_uri: str, mime_type: str = "application/octet-stream") -> dict[str, str]:
        return {"file_uri": file_uri, "mime_type": mime_type}


class _Models:
    def __init__(self, client: "MistralClient"):
        self.client = client

    @staticmethod
    def _text(contents: Any) -> str:
        if isinstance(contents, str):
            return contents
        if isinstance(contents, list):
            values = []
            for item in contents:
                if isinstance(item, str):
                    values.append(item)
                elif isinstance(item, dict):
                    values.append(item.get("text", item.get("file_uri", "")))
                else:
                    values.append(getattr(item, "text", ""))
            return "\n".join(v for v in values if v)
        return str(contents)

    async def generate_content(
        self,
        model: str,
        contents: Any,
        config: Optional[MistralConfig] = None,
        **kwargs
    ) -> SimpleNamespace:
        config = config or MistralConfig()
        messages = []
        if config.system_instruction:
            messages.append({"role": "system", "content": config.system_instruction})
        messages.append({"role": "user", "content": self._text(contents)})

        response = await self.client._client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=config.temperature,
            max_tokens=config.max_output_tokens,
            stream=False
        )
        content = response.choices[0].message.content or ""
        return SimpleNamespace(text=content, choices=response.choices)

    async def generate_content_stream(
        self,
        model: str,
        contents: Any,
        config: Optional[MistralConfig] = None,
        **kwargs
    ) -> AsyncIterator[Any]:
        """Stream chat completions using AsyncOpenAI."""
        config = config or MistralConfig()
        messages = []
        if config.system_instruction:
            messages.append({"role": "system", "content": config.system_instruction})
        messages.append({"role": "user", "content": self._text(contents)})

        stream = await self.client._client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=config.temperature,
            max_tokens=config.max_output_tokens,
            stream=True
        )
        async for chunk in stream:
            yield chunk


class MistralClient:
    def __init__(self, api_key: str, base_url: str = "https://api.mistral.ai/v1"):
        self.api_key = api_key or "placeholder_key"
        self.base_url = base_url
        self._client = AsyncOpenAI(api_key=self.api_key, base_url=self.base_url)
        self._mistral = None
        self.chat = None
        if Mistral is not None and api_key:
            try:
                self._mistral = Mistral(api_key=self.api_key)
                self.chat = getattr(self._mistral, "chat", None)
            except Exception as e:
                logger.debug(f"Mistral SDK native init skipped: {e}")
        self.models = _Models(self)
        self.aio = self
