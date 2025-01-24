"""AI 服务封装

提供统一的 AI 模型调用接口，支持 DeepSeek API
"""

import os
import logging
import time
from typing import Optional, List, Dict, Any
from openai import OpenAI
from dotenv import load_dotenv
from tenacity import retry, stop_after_attempt, wait_exponential

logger = logging.getLogger(__name__)

load_dotenv()


class AIService:
    """AI 服务封装类"""

    def __init__(self):
        """初始化 DeepSeek API 客户端"""
        self.client = OpenAI(
            api_key=os.getenv("DEEPSEEK_API_KEY"), base_url="https://api.deepseek.com"
        )
        # 设置默认 token 限制
        self.default_max_tokens = int(
            os.getenv("MAX_TOKENS", "300")
        )  # 降低默认 token 数

    @retry(
        stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10)
    )
    async def _make_api_call(self, **kwargs):
        """统一的 API 调用方法,包含重试机制"""
        try:
            response = self.client.chat.completions.create(**kwargs)
            content = response.choices[0].message.content
            logger.info(f"API 调用成功，返回内容长度: {len(content)}")
            return content
        except Exception as e:
            logger.error(f"API 调用失败: {str(e)}")
            raise

    async def generate_world_description(self, prompt: str) -> str:
        """使用 DeepSeek API 生成世界描述"""
        try:
            content = await self._make_api_call(
                model="deepseek-chat",
                messages=[
                    {
                        "role": "system",
                        "content": "你是一个专业的虚拟世界设定创作者，擅长创造独特而合理的世界观。",
                    },
                    {"role": "user", "content": prompt},
                ],
                temperature=0.7,
                max_tokens=200,
            )
            logger.info(f"生成的世界描述: {content}")
            return content
        except Exception as e:
            logger.error(f"生成世界描述时出错: {str(e)}")
            raise

    async def generate_geography(self, world_context: str) -> str:
        """基于世界背景生成地理信息"""
        try:
            prompt = f"基于以下世界背景，生成详细的地理环境描述：\n{world_context}"
            return await self._make_api_call(
                model="deepseek-chat",
                messages=[
                    {
                        "role": "system",
                        "content": "你是一个专业的地理环境设计师，擅长创造符合逻辑的虚拟世界地理环境。",
                    },
                    {"role": "user", "content": prompt},
                ],
                temperature=0.7,
                max_tokens=150,  # 减少 token 数
            )
        except Exception as e:
            logger.error(f"生成地理信息时出错: {str(e)}")
            raise

    async def generate_culture(self, world_context: str, geography: str) -> str:
        """基于世界背景和地理环境生成文明文化"""
        try:
            prompt = f"""用简短的语言描述这个世界的文明文化：
            世界背景：{world_context[:100]}...  # 截断输入
            地理环境：{geography[:100]}...      # 截断输入"""

            return await self._make_api_call(
                model="deepseek-chat",
                messages=[
                    {
                        "role": "system",
                        "content": "你是一个简洁的文化描述者。请用最少的文字描述文明文化。",
                    },
                    {"role": "user", "content": prompt},
                ],
                temperature=0.7,
                max_tokens=150,  # 减少 token 数
            )
        except Exception as e:
            logger.error(f"生成文明文化时出错: {str(e)}")
            raise

    async def generate_text(
        self, prompt: str, max_tokens: int = None, temperature: float = 0.7
    ) -> str:
        """生成文本"""
        try:
            return await self._make_api_call(
                model="deepseek-chat",
                messages=[
                    {
                        "role": "system",
                        "content": "请用简洁的语言回答。",
                    },
                    {"role": "user", "content": prompt},
                ],
                temperature=temperature,
                max_tokens=max_tokens or self.default_max_tokens,
            )
        except Exception as e:
            logger.error(f"生成文本失败: {str(e)}")
            raise
