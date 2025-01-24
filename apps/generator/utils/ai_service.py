"""AI 服务封装

提供统一的 AI 模型调用接口，支持多种模型服务
"""

import os
import logging
from typing import Optional, List, Dict, Any
import httpx
from openai import OpenAI, AsyncOpenAI

logger = logging.getLogger(__name__)


class AIService:
    """AI 服务封装类"""

    def __init__(self, service_type: str = "openai"):
        """初始化 AI 服务

        Args:
            service_type: 服务类型，支持 "openai" 或 "deepseek"
        """
        self.service_type = service_type

        if service_type == "openai":
            self.client = OpenAI(
                api_key=os.getenv("OPENAI_API_KEY"),
                base_url=os.getenv("OPENAI_API_BASE", "https://api.openai.com/v1"),
            )
        elif service_type == "deepseek":
            self.api_key = os.getenv("DEEPSEEK_API_KEY")
            self.api_base = os.getenv("DEEPSEEK_API_BASE")
        else:
            raise ValueError(f"不支持的服务类型: {service_type}")

    async def generate_text(
        self, prompt: str, max_tokens: int = 1000, temperature: float = 0.7, **kwargs
    ) -> str:
        """生成文本

        Args:
            prompt: 提示词
            max_tokens: 最大生成长度
            temperature: 采样温度
            **kwargs: 其他参数

        Returns:
            生成的文本
        """
        try:
            if self.service_type == "openai":
                response = await self._generate_openai(
                    prompt, max_tokens, temperature, **kwargs
                )
            elif self.service_type == "deepseek":
                response = await self._generate_deepseek(
                    prompt, max_tokens, temperature, **kwargs
                )
            else:
                raise ValueError(f"不支持的服务类型: {self.service_type}")

            return response

        except Exception as e:
            logger.error(f"生成文本失败: {str(e)}")
            raise

    async def _generate_openai(
        self, prompt: str, max_tokens: int, temperature: float, **kwargs
    ) -> str:
        """调用 OpenAI API 生成文本"""
        async_client = AsyncOpenAI(
            api_key=os.getenv("OPENAI_API_KEY"),
            base_url=os.getenv("OPENAI_API_BASE", "https://api.openai.com/v1"),
        )

        response = await async_client.chat.completions.create(
            model=kwargs.get("model", "gpt-3.5-turbo"),
            messages=[{"role": "user", "content": prompt}],
            max_tokens=max_tokens,
            temperature=temperature,
        )

        return response.choices[0].message.content

    async def _generate_deepseek(
        self, prompt: str, max_tokens: int, temperature: float, **kwargs
    ) -> str:
        """调用 Deepseek API 生成文本"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.api_base}/v1/chat/completions",
                headers={"Authorization": f"Bearer {self.api_key}"},
                json={
                    "model": kwargs.get("model", "deepseek-chat"),
                    "messages": [{"role": "user", "content": prompt}],
                    "max_tokens": max_tokens,
                    "temperature": temperature,
                },
            )
            response.raise_for_status()
            return response.json()["choices"][0]["message"]["content"]
