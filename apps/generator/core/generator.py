from datetime import datetime
import logging
import random

logger = logging.getLogger(__name__)


class WorldGenerator:
    def __init__(
        self,
        seed: str = "",
        complexity: int = 1,
        focus_areas: list = None,
        additional_params: dict = None,
    ):
        """初始化世界生成器

        Args:
            seed: 生成种子
            complexity: 复杂度(1-10)
            focus_areas: 重点关注领域列表
            additional_params: 额外参数字典
        """
        self.seed = seed
        self.complexity = max(1, min(complexity, 10))  # 限制复杂度范围
        self.focus_areas = focus_areas or []
        self.additional_params = additional_params or {}

        # 初始化随机数生成器
        self.random = random.Random(seed) if seed else random.Random()

    def generate(self) -> dict:
        """生成世界数据"""
        try:
            # 基础世界数据结构
            world_data = {
                "seed": self.seed,
                "complexity": self.complexity,
                "metadata": {
                    "created_at": datetime.now().isoformat(),
                    "focus_areas": self.focus_areas,
                },
                "content": {
                    "geography": self._generate_geography(),
                    "culture": self._generate_culture(),
                    "history": self._generate_history(),
                    "religion": self._generate_religion(),
                    "civilization": self._generate_civilization(),
                },
            }

            # 添加提示词相关信息
            if "prompt" in self.additional_params:
                world_data["metadata"]["prompt"] = self.additional_params["prompt"]

            return world_data

        except Exception as e:
            logger.error(f"生成世界时发生错误: {str(e)}")
            raise

    def _generate_geography(self) -> dict:
        """生成地理信息"""
        terrains = ["平原", "山地", "沙漠", "森林", "海洋"]
        climates = ["温带", "热带", "寒带", "地中海性", "大陆性"]

        return {
            "regions": [
                {
                    "name": f"区域-{i+1}",
                    "terrain": self.random.choice(terrains),
                    "climate": self.random.choice(climates),
                }
                for i in range(self.random.randint(2, self.complexity + 2))
            ],
            "climate": self.random.choice(climates),
            "terrain": self.random.choice(terrains),
        }

    def _generate_culture(self) -> dict:
        """生成文化信息"""
        traditions = ["古老", "现代", "混合", "神秘", "实用"]
        languages = ["通用语", "古语", "方言", "混合语", "神秘语言"]

        return {
            "traditions": [
                {
                    "name": f"传统-{i+1}",
                    "type": self.random.choice(traditions),
                }
                for i in range(self.random.randint(2, self.complexity + 2))
            ],
            "languages": [
                {
                    "name": f"语言-{i+1}",
                    "type": self.random.choice(languages),
                }
                for i in range(self.random.randint(1, self.complexity + 1))
            ],
            "customs": [],
        }

    def _generate_history(self) -> dict:
        """生成历史信息"""
        event_types = ["政治", "文化", "战争", "灾难", "发现"]

        return {
            "events": [
                {
                    "name": f"事件-{i+1}",
                    "type": self.random.choice(event_types),
                    "year": self.random.randint(-1000, 1000),
                }
                for i in range(self.random.randint(3, self.complexity + 5))
            ],
            "eras": [
                {
                    "name": f"时代-{i+1}",
                    "start_year": -1000 + i * 500,
                    "end_year": -500 + i * 500,
                }
                for i in range(3)
            ],
            "timeline": [],
        }

    def _generate_religion(self) -> dict:
        """生成宗教信息"""
        belief_types = ["自然崇拜", "多神教", "一神教", "哲学思想", "混合信仰"]

        return {
            "beliefs": [
                {
                    "name": f"信仰-{i+1}",
                    "type": self.random.choice(belief_types),
                }
                for i in range(self.random.randint(1, self.complexity + 1))
            ],
            "practices": [],
            "deities": [],
        }

    def _generate_civilization(self) -> dict:
        """生成文明信息"""
        society_types = ["部落", "城邦", "帝国", "联邦", "王国"]
        tech_levels = ["原始", "古代", "中世纪", "工业化", "现代"]

        return {
            "societies": [
                {
                    "name": f"社会-{i+1}",
                    "type": self.random.choice(society_types),
                }
                for i in range(self.random.randint(2, self.complexity + 2))
            ],
            "technology": {
                "level": self.random.choice(tech_levels),
                "advancements": [],
            },
            "politics": {
                "system": self.random.choice(["君主制", "共和制", "部落制", "联邦制"]),
                "organizations": [],
            },
        }
