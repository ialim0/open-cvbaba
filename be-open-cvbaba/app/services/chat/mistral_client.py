"""Small async compatibility client for Mistral's OpenAI-compatible API."""
from dataclasses import dataclass
from types import SimpleNamespace
from typing import Any, AsyncIterator
from openai import AsyncOpenAI
try:
    from mistralai import Mistral
except ImportError:
    try:
        from mistralai.client import Mistral
    except ImportError:
        Mistral = None

class MistralClientError(Exception): pass
@dataclass
class MistralConfig:
    temperature: float = 0.5
    max_output_tokens: int = 2500
    top_p: float = 0.9
    top_k: int = 40
    response_mime_type: str | None = None
    system_instruction: str | None = None
class MistralPart:
    @staticmethod
    def from_uri(file_uri: str, mime_type: str = "application/octet-stream") -> dict[str, str]:
        return {"file_uri": file_uri, "mime_type": mime_type}
class _Models:
    def __init__(self, client): self.client = client
    @staticmethod
    def _text(contents: Any) -> str:
        if isinstance(contents, str): return contents
        if isinstance(contents, list):
            values=[]
            for item in contents:
                if isinstance(item, str): values.append(item)
                elif isinstance(item, dict): values.append(item.get("text", item.get("file_uri", "")))
                else: values.append(getattr(item, "text", ""))
            return "\n".join(v for v in values if v)
        return str(contents)
    async def generate_content(self, model: str, contents: Any, config: MistralConfig | None = None, **kwargs):
        config=config or MistralConfig(); messages=[]
        if config.system_instruction: messages.append({"role":"system","content":config.system_instruction})
        messages.append({"role":"user","content":self._text(contents)})
        response=await self.client._client.chat.completions.create(model=model,messages=messages,temperature=config.temperature,max_tokens=config.max_output_tokens,stream=False)
        return SimpleNamespace(text=response.choices[0].message.content or "", choices=response.choices)
    async def generate_content_stream(self, model: str, contents: Any, config: MistralConfig | None = None, **kwargs) -> AsyncIterator[Any]:
        """Stream through Mistral's native Chat Completion API."""
        config = config or MistralConfig()
        messages = []
        if config.system_instruction:
            messages.append({"role": "system", "content": config.system_instruction})
        messages.append({"role": "user", "content": self._text(contents)})
        stream = await self.client.chat.stream_async(
            model=model,
            messages=messages,
            temperature=config.temperature,
            max_tokens=config.max_output_tokens,
        )
        async for chunk in stream:
            yield chunk
class MistralClient:
    def __init__(self, api_key: str, base_url: str = "https://api.mistral.ai/v1"):
        self._client = AsyncOpenAI(api_key=api_key, base_url=base_url)
        self._mistral = Mistral(api_key=api_key)
        self.models = _Models(self)
        self.chat = self._mistral.chat
        self.aio = self
