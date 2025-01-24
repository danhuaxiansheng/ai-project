from typing import Dict, List, Optional, Any
import json
import numpy as np
import jieba
import jieba.analyse
from collections import defaultdict
from datetime import datetime
import logging
import random
import os
from utils.ai_service import AIService

logger = logging.getLogger(__name__)


class VirtualWorldGenerator:
    """虚拟世界生成器"""

    def __init__(
        self,
        seed: Optional[str] = None,
        complexity: int = 5,
        focus_areas: Optional[List[str]] = None,
        additional_params: Optional[Dict] = None,
    ):
        """
        初始化虚拟世界生成器

        Args:
            seed: 随机种子
            complexity: 复杂度 (1-10)
            focus_areas: 重点关注领域
            additional_params: 其他参数
        """
        self.seed = seed or f"world-{random.randint(1000, 9999)}"
        self.complexity = min(max(complexity, 1), 10)  # 确保在1-10范围内
        self.focus_areas = focus_areas or ["geography", "civilization", "culture"]
        self.additional_params = additional_params or {}

        # 初始化随机数生成器
        self.random = random.Random(self.seed)

        # 初始化 AI 服务
        self.ai_service = AIService()

        logger.info(f"初始化世界生成器: seed={self.seed}, complexity={self.complexity}")

        # 初始化jieba分词
        jieba.initialize()

        # 预定义主题关键词映射
        self.theme_keywords = {
            "科技": ["科技", "机器", "发明", "进步", "文明", "现代"],
            "魔法": ["魔法", "巫师", "法术", "神秘", "魔力", "咒语"],
            "自然": ["自然", "生态", "森林", "山脉", "河流", "生命"],
            "战争": ["战争", "冲突", "战斗", "军队", "武器", "征服"],
            "和平": ["和平", "和谐", "共存", "友好", "合作", "发展"],
        }

        # 添加气候和资源相关的预定义数据
        self.climate_types = {
            "热带": ["潮湿", "炎热", "多雨", "常年高温"],
            "温带": ["四季分明", "温和", "适宜", "季节变化"],
            "寒带": ["寒冷", "冰雪", "苔原", "极地"],
            "干旱": ["干燥", "少雨", "炎热", "昼夜温差大"],
        }

        self.resource_types = {
            "矿产": ["金属", "宝石", "能源", "矿石"],
            "生物": ["植物", "动物", "药材", "食材"],
            "水资源": ["淡水", "地下水", "温泉", "河流"],
            "能源": ["太阳能", "风能", "水能", "魔力源"],
        }

        # 添加提示模板
        self.prompts = {
            "origin": "这个世界的起源是：{context}",
            "geography": "这片大地上有：{context}",
            "development": "文明的发展历程是：{context}",
        }

    async def generate_world(self) -> Dict:
        """
        生成完整的虚拟世界

        Returns:
            包含世界信息的字典
        """
        try:
            # 获取用户输入的提示词
            prompt = self.additional_params.get("prompt", "")

            # 生成世界基础描述
            world_description = await self.ai_service.generate_world_description(
                f"""基于以下提示词创建一个独特的虚拟世界背景:
                提示词: {prompt}
                复杂度: {self.complexity}
                重点领域: {', '.join(self.focus_areas)}
                """
            )
            logger.info(f"生成的世界描述")

            # 生成地理信息
            geography_data = await self.ai_service.generate_geography(world_description)
            logger.info(f"生成的地理信息")

            # 生成地形数据
            terrain_data = self._identify_terrain_types()
            climate_data = self._generate_climate_zones()
            resource_data = self._generate_resources()

            # 解析地理信息为结构化数据
            geography = {
                "description": geography_data,
                "terrain": terrain_data,
                "climate": {
                    "zones": climate_data,
                    "summary": "多样的气候带",
                },
                "resources": {
                    "items": resource_data,
                    "summary": "丰富的自然资源",
                },
            }

            # 生成文明文化
            culture_data = await self.ai_service.generate_culture(
                world_description, geography_data
            )
            logger.info(f"生成的文明文化")

            # 生成文明相关数据
            civilization_data = self._generate_civilizations()
            belief_data = self._generate_beliefs()
            custom_data = self._generate_customs()
            art_data = self._generate_arts()
            social_data = self._generate_social_structure()

            # 解析文明文化为结构化数据
            culture = {
                "description": culture_data,
                "civilization": civilization_data,
                "beliefs": belief_data,
                "customs": custom_data,
                "arts": art_data,
                "social_structure": social_data,
            }

            # 整合所有信息
            world_data = {
                "success": True,
                "data": {
                    "id": None,  # 将由存储系统设置
                    "seed": self.seed,
                    "complexity": self.complexity,
                    "focus_areas": self.focus_areas,
                    "description": world_description,
                    "geography": geography,
                    "culture": culture,
                    "metadata": {
                        "generated_at": str(datetime.now()),
                        "version": "1.0",
                        "prompt": prompt,
                    },
                },
                "message": "世界生成成功",
            }

            # 记录生成的数据结构
            logger.info(
                f"生成的世界数据结构: {json.dumps(world_data, ensure_ascii=False, indent=2)}"
            )

            return world_data

        except Exception as e:
            logger.error(f"生成世界失败: {str(e)}")
            logger.exception("详细错误信息：")
            raise

    def process_input(self, user_input: str) -> Dict:
        """处理用户输入，提取关键信息"""
        keywords = self._extract_keywords(user_input)
        parsed_data = {
            "raw_input": user_input,
            "keywords": keywords,
            "themes": self._identify_themes(keywords),
        }
        return parsed_data

    def _extract_keywords(self, text: str) -> List[str]:
        """提取文本中的关键词"""
        # 使用jieba提取关键词
        keywords = jieba.analyse.extract_tags(
            text, topK=10, withWeight=False  # 提取前10个关键词
        )

        # 添加自定义关键词提取逻辑
        custom_keywords = []
        for word in jieba.cut(text):
            if len(word) >= 2 and word not in keywords:
                custom_keywords.append(word)

        return list(set(keywords + custom_keywords[:5]))

    def _identify_themes(self, keywords: List[str]) -> List[str]:
        """识别关键主题"""
        theme_scores = defaultdict(int)

        # 计算每个主题的匹配分数
        for keyword in keywords:
            for theme, theme_keywords in self.theme_keywords.items():
                if keyword in theme_keywords:
                    theme_scores[theme] += 1

        # 选择得分最高的主题（最多3个）
        sorted_themes = sorted(theme_scores.items(), key=lambda x: x[1], reverse=True)

        return [theme for theme, score in sorted_themes[:3] if score > 0]

    async def _generate_geography(self) -> Dict[str, Any]:
        """生成地理信息"""
        prompt = self.prompts["geography"].format(
            context=self.additional_params.get("geography_prompt", "一片神秘的大地")
        )
        description = await self._generate_description(prompt)

        return {
            "description": description,
            "terrain_types": self._identify_terrain_types(),
            "climate_zones": self._generate_climate_zones(),
            "resources": self._generate_resources(),
        }

    def _generate_development(self, parsed_data: Dict) -> Dict:
        """生成发展历程"""
        themes = parsed_data["themes"]
        prompt = self.prompts["development"].format(context=", ".join(themes))

        development_desc = self.nlp_model(
            prompt, max_length=300, num_return_sequences=1
        )[0]["generated_text"]

        return {
            "description": development_desc,
            "civilizations": self._generate_civilizations(),
            "major_events": self._extract_major_events(development_desc),
            "cultural_elements": self._generate_cultural_elements(),
        }

    def generate_world_structure(self, parsed_data: Dict) -> Dict:
        """根据解析的数据生成世界结构"""
        world_structure = {
            "origin": self._generate_origin(parsed_data),
            "geography": self._generate_geography(),
            "development": self._generate_development(parsed_data),
        }
        return world_structure

    def generate_novel_description(self, world_structure: Dict) -> str:
        """将世界结构转换为小说化的描述"""
        sections = []

        # 添加世界起源描述
        sections.append("## 世界的起源")
        sections.append(world_structure["origin"]["story"])

        # 添加地理环境描述
        sections.append("\n## 地理环境")
        sections.append(world_structure["geography"]["description"])

        # 添加文明发展描述
        sections.append("\n## 文明发展")
        sections.append(world_structure["development"]["description"])

        return "\n".join(sections)

    def save_output(self, description: str, filename: str = "virtual_world.txt"):
        """保存生成的世界描述"""
        with open(filename, "w", encoding="utf-8") as f:
            f.write(description)

    def _extract_key_events(self, story: str) -> List[Dict]:
        """从故事中提取关键事件"""
        events = []
        sentences = story.split("。")

        for sentence in sentences:
            if not sentence.strip():
                continue

            # 使用关键词匹配识别重要事件
            keywords = jieba.analyse.extract_tags(sentence, topK=3)
            if keywords:
                events.append({"description": sentence, "keywords": keywords})

        return events

    def _create_timeline(self, story: str) -> List[Dict]:
        """创建时间线"""
        # 提取时间相关的描述
        time_indicators = ["最初", "然后", "之后", "最终", "现在"]
        timeline = []

        sentences = story.split("。")
        current_time = "起初"

        for sentence in sentences:
            for indicator in time_indicators:
                if indicator in sentence:
                    timeline.append({"time": current_time, "event": sentence.strip()})
                    current_time = indicator
                    break

        return timeline

    def _identify_terrain_types(self) -> Dict[str, Any]:
        """识别地形类型"""
        terrain_types = [
            {"name": "山地", "description": "高耸的山脉绵延不绝"},
            {"name": "平原", "description": "广阔的平原一望无际"},
            {"name": "水域", "description": "清澈的水域点缀其中"},
            {"name": "森林", "description": "茂密的森林覆盖大地"},
            {"name": "沙漠", "description": "荒芜的沙漠延伸至远方"},
        ]

        selected_terrains = self.random.sample(
            terrain_types, k=self.random.randint(2, min(4, self.complexity + 1))
        )

        # 将地形信息格式化为字符串
        terrain_text = "、".join([t["name"] for t in selected_terrains])
        terrain_descriptions = "\n".join([t["description"] for t in selected_terrains])

        return {
            "types": selected_terrains,
            "summary": terrain_text,
            "description": terrain_descriptions,
        }

    def _generate_climate_zones(self) -> List[Dict]:
        """生成气候区域"""
        climate_zones = []
        selected_climates = self.random.sample(
            list(self.climate_types.keys()),
            k=self.random.randint(2, min(4, self.complexity + 1)),
        )

        for climate in selected_climates:
            features = self.random.sample(self.climate_types[climate], k=2)
            climate_zones.append(
                {
                    "type": climate,
                    "features": features,
                    "description": f"{climate}气候，特点是{'和'.join(features)}",
                }
            )

        return climate_zones

    def _generate_resources(self) -> List[Dict]:
        """生成自然资源"""
        resources = []
        for resource_type, resource_list in self.resource_types.items():
            selected_resources = self.random.sample(
                resource_list, k=self.random.randint(1, min(3, self.complexity))
            )

            for resource in selected_resources:
                resources.append(
                    {
                        "type": resource_type,
                        "name": resource,
                        "abundance": self.random.choice(["丰富", "中等", "稀少"]),
                        "distribution": f"主要分布在{self.random.choice(['北部', '南部', '东部', '西部', '中央'])}",
                    }
                )

        return resources

    def _generate_civilizations(self) -> Dict[str, Any]:
        """生成文明信息"""
        # 定义可能的技术水平
        tech_levels = [
            {"name": "原始", "description": "使用简单的石器工具"},
            {"name": "农耕", "description": "发展出农业和畜牧"},
            {"name": "青铜", "description": "掌握了金属冶炼技术"},
            {"name": "工业", "description": "开始机械化生产"},
            {"name": "信息", "description": "发展出先进的通信技术"},
            {"name": "魔法", "description": "掌握了神秘的魔法力量"},
        ]

        # 根据复杂度选择技术水平
        tech_level = self.random.choice(tech_levels[: max(2, self.complexity)])

        # 生成文明特征
        civilization_types = [
            "游牧文明",
            "农耕文明",
            "海洋文明",
            "山地文明",
            "森林文明",
            "沙漠文明",
            "魔法文明",
            "科技文明",
        ]

        # 选择文明类型
        civ_type = self.random.choice(civilization_types)

        # 生成发展阶段
        development_stages = [
            "萌芽期",
            "成长期",
            "鼎盛期",
            "转型期",
            "衰退期",
            "复兴期",
        ]
        current_stage = self.random.choice(development_stages)

        return {
            "type": civ_type,
            "technology": tech_level,
            "development_stage": current_stage,
            "characteristics": [
                "独特的" + civ_type,
                f"{tech_level['name']}级技术水平",
                f"处于{current_stage}",
            ],
            "description": (
                f"这是一个{civ_type}，"
                f"已经发展出{tech_level['name']}级技术水平，"
                f"{tech_level['description']}。"
                f"目前正处于{current_stage}。"
            ),
        }

    def _generate_beliefs(self) -> List[str]:
        """生成信仰体系"""
        belief_elements = [
            "自然崇拜",
            "祖先崇拜",
            "神灵信仰",
            "科学理性",
            "魔法信仰",
            "混合信仰",
        ]
        return np.random.choice(belief_elements, size=2, replace=False).tolist()

    def _generate_customs(self) -> List[str]:
        """生成习俗"""
        custom_elements = [
            "季节庆典",
            "成年仪式",
            "婚丧礼仪",
            "节日庆祝",
            "祭祀活动",
            "传统手工艺",
        ]
        return np.random.choice(custom_elements, size=3, replace=False).tolist()

    def _generate_arts(self) -> List[str]:
        """生成艺术形式"""
        art_elements = [
            "音乐传统",
            "舞蹈艺术",
            "绘画艺术",
            "雕塑艺术",
            "文学创作",
            "建筑艺术",
        ]
        return np.random.choice(art_elements, size=2, replace=False).tolist()

    def _generate_social_structure(self) -> Dict:
        """生成社会结构"""
        return {
            "system": np.random.choice(["等级制", "民主制", "部落制", "混合制"]),
            "classes": np.random.choice(["两级分化", "三级分化", "多级分化"]),
            "mobility": np.random.choice(["高度流动", "中等流动", "低度流动"]),
        }

    async def _generate_description(self, prompt: str) -> str:
        """生成描述文本"""
        try:
            return await self.ai_service.generate_text(
                prompt=prompt, max_tokens=500, temperature=0.7
            )
        except Exception as e:
            logger.error(f"生成描述失败: {str(e)}")
            # 返回默认描述
            return "这是一个神秘的世界..."
