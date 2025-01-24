from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, validator
from typing import List, Optional, Dict, Any
import uvicorn
import logging
from datetime import datetime
import random
import hashlib
import re
import jieba
import jieba.analyse
from utils.file_storage import FileStorage
import os
import json
import shutil
from middleware.error_handler import ErrorHandlerMiddleware

# 配置日志
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

app = FastAPI(title="虚拟世界生成器 API")

# 更新 CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",  # 添加新的开发服务器端口
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# 添加错误处理中间件
app.add_middleware(ErrorHandlerMiddleware)

# 初始化文件存储
file_storage = FileStorage()


class WorldGenerationParams(BaseModel):
    seed: Optional[str] = None
    complexity: int
    focus_areas: List[str]
    additional_params: Optional[dict] = None
    project_name: Optional[str] = None  # 添加项目名称参数

    @validator("complexity")
    def validate_complexity(cls, v):
        if not 1 <= v <= 10:
            raise ValueError("复杂度必须在1到10之间")
        return v

    @validator("focus_areas")
    def validate_focus_areas(cls, v):
        valid_areas = {"geography", "civilization", "history", "culture", "religion"}
        if not v:
            raise ValueError("至少需要选择一个重点领域")
        if not all(area in valid_areas for area in v):
            raise ValueError("包含无效的重点领域")
        return v


class PromptAnalysis(BaseModel):
    prompt: str


class PromptAnalysisResult(BaseModel):
    suggestedSeed: Optional[str] = None
    suggestedComplexity: Optional[int] = None
    suggestedFocusAreas: Optional[List[str]] = None
    analysis: Dict = {}


# 模拟 WorldGenerator 类（临时）
class WorldGenerator:
    def generate_world(
        self, seed: Optional[str], complexity: int, focus_areas: List[str], **kwargs
    ) -> Dict:
        try:
            # 如果没有提供种子，生成一个随机种子
            if not seed:
                seed = hashlib.md5(str(random.random()).encode()).hexdigest()[:8]

            # 使用种子初始化随机数生成器
            random_generator = random.Random(seed)

            # 获取提示词
            prompt = kwargs.get("prompt", "").strip()

            # 生成世界ID
            world_id = f"world-{seed}"

            # 生成基础数据
            world_data = {
                "id": world_id,
                "version": "1.0.0",
                "timestamp": datetime.now().isoformat(),
                "seed": seed,
                "name": f"世界-{seed[:6]}",
                "description": self._generate_description(prompt, random_generator),
                "tags": focus_areas,
                "created_at": datetime.now().isoformat(),
                "data": {
                    "geography": self._generate_geography(random_generator),
                    "civilization": self._generate_civilization(random_generator),
                    "history": self._generate_history(random_generator, complexity),
                    "races": self._generate_races(random_generator, complexity),
                    "systems": self._generate_systems(
                        random_generator, complexity, focus_areas
                    ),
                },
            }

            return world_data
        except Exception as e:
            logger.error(f"World generation error: {str(e)}")
            raise

    def _generate_description(
        self, prompt: str, random_generator: random.Random
    ) -> str:
        """生成世界描述"""
        if prompt:
            return prompt[:200]  # 限制长度

        templates = [
            "这是一个{adj}的世界，{feature}。",
            "在这片{adj}的土地上，{feature}。",
            "这里是一个{adj}的地方，{feature}。",
        ]

        adjectives = ["神秘", "壮丽", "奇特", "和谐", "充满活力"]
        features = [
            "蕴含着无限可能",
            "孕育着独特的文明",
            "有着丰富的历史传说",
            "自然与文明和谐共存",
            "正在经历巨大的变革",
        ]

        template = random_generator.choice(templates)
        adj = random_generator.choice(adjectives)
        feature = random_generator.choice(features)

        return template.format(adj=adj, feature=feature)

    def _generate_geography(self, random_generator: random.Random) -> Dict:
        """生成地理环境"""
        terrains = {
            "plains": "平原",
            "mountains": "山地",
            "desert": "沙漠",
            "forest": "森林",
            "coastal": "沿海",
            "islands": "群岛",
            "plateau": "高原",
        }

        climates = {
            "temperate": "温带",
            "tropical": "热带",
            "arctic": "寒带",
            "mediterranean": "地中海性",
            "continental": "大陆性",
        }

        terrain = random_generator.choice(list(terrains.keys()))
        climate = random_generator.choice(list(climates.keys()))

        return {
            "terrain": terrain,
            "terrain_name": terrains[terrain],
            "climate": climate,
            "climate_name": climates[climate],
            "description": self._generate_geography_description(terrain, climate),
        }

    def _generate_geography_description(self, terrain: str, climate: str) -> str:
        """生成地理描述"""
        templates = {
            "plains": "广阔的平原上{feature}",
            "mountains": "巍峨的山脉{feature}",
            "desert": "辽阔的沙漠中{feature}",
            "forest": "茂密的森林里{feature}",
            "coastal": "绵长的海岸线{feature}",
            "islands": "散布的岛屿{feature}",
            "plateau": "高耸的高原{feature}",
        }

        climate_features = {
            "temperate": "四季分明，气候宜人",
            "tropical": "常年炎热潮湿",
            "arctic": "终年寒冷",
            "mediterranean": "冬暖夏凉",
            "continental": "冬寒夏热",
        }

        template = templates.get(terrain, "这片土地{feature}")
        climate_feature = climate_features.get(climate, "")

        return template.format(feature=f"，{climate_feature}。")

    def _generate_civilization(self, random_generator: random.Random) -> Dict:
        """生成文明特征"""
        # 技术水平定义
        tech_levels = {
            "primitive": "原始",
            "medieval": "中世纪",
            "renaissance": "文艺复兴",
            "industrial": "工业化",
            "modern": "现代",
            "futuristic": "未来",
            "magical": "魔法",
        }

        # 社会结构定义
        social_structures = {
            "tribal": "部落制",
            "feudal": "封建制",
            "monarchy": "君主制",
            "republic": "共和制",
            "democracy": "民主制",
            "technocracy": "技术官僚制",
            "theocracy": "神权制",
        }

        # 主要产业定义
        industries = {
            "agriculture": "农业",
            "commerce": "商业",
            "crafting": "手工业",
            "mining": "采矿业",
            "magic": "魔法产业",
            "technology": "科技产业",
            "education": "教育产业",
        }

        # 文化特征定义
        cultural_values = {
            "honor": "荣誉",
            "wisdom": "智慧",
            "progress": "进步",
            "harmony": "和谐",
            "power": "力量",
        }

        beliefs = {
            "spiritual": "精神信仰",
            "rational": "理性思维",
            "balanced": "平衡之道",
            "naturalistic": "自然崇拜",
            "scientific": "科学至上",
        }

        customs = {
            "traditional": "传统",
            "progressive": "进步",
            "mixed": "混合",
            "innovative": "创新",
            "conservative": "保守",
        }

        # 随机选择特征
        tech_level = random_generator.choice(list(tech_levels.keys()))
        social_structure = random_generator.choice(list(social_structures.keys()))
        selected_industries = random_generator.sample(list(industries.keys()), k=3)

        # 生成人口规模（基于技术水平调整）
        population_base = {
            "primitive": (1000, 10000),
            "medieval": (10000, 100000),
            "renaissance": (50000, 500000),
            "industrial": (100000, 1000000),
            "modern": (500000, 5000000),
            "futuristic": (1000000, 10000000),
            "magical": (10000, 1000000),
        }
        pop_range = population_base[tech_level]
        population_size = random_generator.randint(*pop_range)

        # 生成文明描述
        description = self._generate_civilization_description(
            tech_level,
            social_structure,
            selected_industries,
            tech_levels,
            social_structures,
            industries,
            random_generator,
        )

        return {
            "technology": {
                "level": tech_level,
                "name": tech_levels[tech_level],
                "description": self._generate_tech_description(tech_level),
            },
            "society": {
                "structure": social_structure,
                "name": social_structures[social_structure],
                "population": population_size,
                "development_level": random_generator.randint(1, 10),
            },
            "culture": {
                "values": random_generator.choice(list(cultural_values.keys())),
                "values_name": cultural_values[
                    random_generator.choice(list(cultural_values.keys()))
                ],
                "beliefs": random_generator.choice(list(beliefs.keys())),
                "beliefs_name": beliefs[random_generator.choice(list(beliefs.keys()))],
                "customs": random_generator.choice(list(customs.keys())),
                "customs_name": customs[random_generator.choice(list(customs.keys()))],
            },
            "economy": {
                "industries": [
                    {"id": ind, "name": industries[ind]} for ind in selected_industries
                ]
            },
            "description": description,
        }

    def _generate_civilization_description(
        self,
        tech_level: str,
        social_structure: str,
        industries: List[str],
        tech_names: Dict,
        social_names: Dict,
        industry_names: Dict,
        random_generator: random.Random,
    ) -> str:
        """生成文明描述"""
        templates = [
            "这是一个{tech}文明，采用{social}的社会制度。",
            "在这个{tech}的世界里，社会以{social}的形式组织。",
            "这个文明处于{tech}阶段，{social}统治着社会秩序。",
        ]

        template = random_generator.choice(templates)
        return template.format(
            tech=tech_names[tech_level], social=social_names[social_structure]
        )

    def _generate_tech_description(self, tech_level: str) -> str:
        """生成技术描述"""
        descriptions = {
            "primitive": "处于原始社会阶段，主要依靠简单工具和口耳相传的知识。",
            "medieval": "已经掌握了基础的金属冶炼和农业技术。",
            "renaissance": "科学与艺术开始蓬勃发展，新思想不断涌现。",
            "industrial": "机械化生产逐渐普及，工业革命正在改变社会。",
            "modern": "科技高度发达，信息化程度很高。",
            "futuristic": "拥有超越现代的尖端科技，正在探索星际文明。",
            "magical": "魔法与科技并存，创造出独特的文明形态。",
        }
        return descriptions.get(tech_level, "技术水平不明。")

    def _generate_history(
        self, random_generator: random.Random, complexity: int
    ) -> Dict:
        """生成历史事件"""
        # 定义历史时期
        eras = {
            "ancient": "远古时期",
            "classical": "古典时期",
            "medieval": "中世纪",
            "renaissance": "复兴时期",
            "modern": "现代",
            "future": "未来纪元",
        }

        # 定义事件类型
        event_types = {
            "political": {
                "name": "政治",
                "templates": [
                    "建立了新的{regime}政权",
                    "发生了重大的{reform}改革",
                    "与邻国缔结了{treaty}同盟",
                ],
            },
            "cultural": {
                "name": "文化",
                "templates": [
                    "出现了新的{philosophy}思潮",
                    "兴起了{art}艺术运动",
                    "发展出独特的{custom}传统",
                ],
            },
            "technological": {
                "name": "科技",
                "templates": [
                    "发明了革命性的{tech}技术",
                    "实现了重大{discovery}突破",
                    "掌握了{knowledge}奥秘",
                ],
            },
            "natural": {
                "name": "自然",
                "templates": [
                    "经历了严重的{disaster}灾害",
                    "气候发生了{climate}变化",
                    "出现了罕见的{phenomenon}现象",
                ],
            },
        }

        # 生成历史时期
        num_eras = max(2, complexity // 3)
        selected_eras = random_generator.sample(list(eras.keys()), k=num_eras)
        selected_eras.sort()  # 确保时期顺序

        history_data = {"eras": [], "events": [], "timeline": []}

        current_year = -1000
        for era in selected_eras:
            era_length = random_generator.randint(200, 500)
            era_data = {
                "name": eras[era],
                "start_year": current_year,
                "end_year": current_year + era_length,
                "description": self._generate_era_description(era),
            }
            history_data["eras"].append(era_data)

            # 为每个时期生成事件
            num_events = random_generator.randint(2, complexity)
            for _ in range(num_events):
                event_type = random_generator.choice(list(event_types.keys()))
                event_template = random_generator.choice(
                    event_types[event_type]["templates"]
                )

                event_year = random_generator.randint(
                    current_year, current_year + era_length
                )
                event_data = {
                    "year": event_year,
                    "type": event_type,
                    "type_name": event_types[event_type]["name"],
                    "description": self._generate_event_description(
                        event_template, random_generator
                    ),
                    "significance": random_generator.randint(1, 5),  # 事件重要性
                }
                history_data["events"].append(event_data)

            current_year += era_length

        # 按年份排序事件
        history_data["events"].sort(key=lambda x: x["year"])

        # 生成时间线摘要
        history_data["timeline"] = self._generate_timeline_summary(
            history_data["events"]
        )

        return history_data

    def _generate_era_description(self, era: str) -> str:
        """生成时代描述"""
        descriptions = {
            "ancient": "文明的曙光初现，人们开始探索世界的奥秘。",
            "classical": "各种思想百花齐放，经典文化逐渐形成。",
            "medieval": "封建制度确立，等级分明的社会结构开始形成。",
            "renaissance": "新思想涌现，艺术与科学获得空前发展。",
            "modern": "科技快速进步，社会发生翻天覆地的变化。",
            "future": "文明跨入新纪元，探索未知的领域。",
        }
        return descriptions.get(era, "这是一个变革的时代。")

    def _generate_event_description(
        self, template: str, random_generator: random.Random
    ) -> str:
        """生成具体事件描述"""
        # 事件细节词库
        details = {
            "regime": ["共和", "帝国", "联邦", "王国", "联盟"],
            "reform": ["政治", "经济", "文化", "军事", "教育"],
            "treaty": ["和平", "贸易", "防御", "文化", "科技"],
            "philosophy": ["理性", "人文", "自然", "科学", "神秘"],
            "art": ["古典", "写实", "抽象", "神秘", "未来"],
            "custom": ["节日", "礼仪", "信仰", "生活", "社交"],
            "tech": ["能源", "交通", "通信", "医疗", "军事"],
            "discovery": ["科学", "魔法", "资源", "领土", "文明"],
            "knowledge": ["自然", "宇宙", "生命", "能量", "时空"],
            "disaster": ["地震", "洪水", "火山", "瘟疫", "干旱"],
            "climate": ["剧烈", "渐进", "周期", "异常", "永久"],
            "phenomenon": ["天文", "地理", "生物", "能量", "时空"],
        }

        # 从模板中提取需要填充的类型
        import re

        detail_types = re.findall(r"\{(\w+)\}", template)

        # 填充细节
        filled_details = {}
        for detail_type in detail_types:
            if detail_type in details:
                filled_details[detail_type] = random_generator.choice(
                    details[detail_type]
                )

        return template.format(**filled_details)

    def _generate_timeline_summary(self, events: List[Dict]) -> List[str]:
        """生成时间线摘要"""
        # 只选取重要性较高的事件
        significant_events = [e for e in events if e["significance"] >= 4]
        return [f"{e['year']}年：{e['description']}" for e in significant_events]

    def _generate_races(self, random_generator: random.Random, complexity: int) -> Dict:
        """生成种族和生物系统"""
        # 智慧种族特征定义
        race_traits = {
            "physical": {  # 体魄特征
                "size": ["矮小", "中等", "高大", "巨型"],
                "build": ["纤细", "匀称", "强壮", "魁梧"],
                "feature": ["灵活", "敏捷", "坚韧", "威猛"],
            },
            "mental": {  # 心智特征
                "intelligence": ["机敏", "聪慧", "博学", "睿智"],
                "personality": ["谨慎", "开放", "神秘", "豪爽"],
                "talent": ["艺术", "技术", "魔法", "战斗"],
            },
            "social": {  # 社会特征
                "organization": ["部落", "城邦", "王国", "联邦"],
                "culture": ["传统", "进步", "神秘", "实用"],
                "relation": ["友好", "中立", "排外", "敌对"],
            },
        }

        # 生物类型定义
        creature_types = {
            "terrestrial": {  # 陆地生物
                "name": "陆地生物",
                "habitats": ["森林", "草原", "山地", "沙漠"],
                "traits": ["奔跑", "攀爬", "挖掘", "跳跃"],
            },
            "aerial": {  # 空中生物
                "name": "空中生物",
                "habitats": ["天空", "山峰", "云端", "悬崖"],
                "traits": ["飞行", "滑翔", "俯冲", "盘旋"],
            },
            "aquatic": {  # 水生生物
                "name": "水生生物",
                "habitats": ["海洋", "河流", "湖泊", "沼泽"],
                "traits": ["游泳", "潜水", "喷射", "漂浮"],
            },
            "magical": {  # 魔法生物
                "name": "魔法生物",
                "habitats": ["魔法森林", "神秘山谷", "远古遗迹", "虚空"],
                "traits": ["施法", "隐形", "传送", "变形"],
            },
        }

        # 生成智慧种族
        num_races = max(1, complexity // 3)
        races_data = {"sentient": [], "creatures": [], "ecosystem": {}}

        # 生成主要种族
        for i in range(num_races):
            race_data = {
                "name": f"种族-{i+1}",  # 这里可以添加种族名称生成器
                "traits": {
                    "physical": {
                        k: random_generator.choice(v)
                        for k, v in race_traits["physical"].items()
                    },
                    "mental": {
                        k: random_generator.choice(v)
                        for k, v in race_traits["mental"].items()
                    },
                    "social": {
                        k: random_generator.choice(v)
                        for k, v in race_traits["social"].items()
                    },
                },
                "description": self._generate_race_description(
                    race_traits, random_generator
                ),
                "population_share": random_generator.randint(10, 40),  # 人口占比
            }
            races_data["sentient"].append(race_data)

        # 生成生物群系
        for creature_type, type_info in creature_types.items():
            num_species = random_generator.randint(2, complexity)
            species_list = []

            for _ in range(num_species):
                species_data = {
                    "name": self._generate_creature_name(
                        creature_type, random_generator
                    ),
                    "habitat": random_generator.choice(type_info["habitats"]),
                    "traits": random_generator.sample(type_info["traits"], k=2),
                    "behavior": self._generate_creature_behavior(random_generator),
                    "significance": self._generate_creature_significance(
                        random_generator
                    ),
                }
                species_list.append(species_data)

            races_data["creatures"].append(
                {
                    "type": creature_type,
                    "type_name": type_info["name"],
                    "species": species_list,
                }
            )

        # 生成生态系统概述
        races_data["ecosystem"] = self._generate_ecosystem_description(
            races_data["creatures"], random_generator
        )

        return races_data

    def _generate_race_description(
        self, traits: Dict, random_generator: random.Random
    ) -> str:
        """生成种族描述"""
        templates = [
            "这是一个{physical}的种族，以{mental}著称，社会形态呈现{social}特征。",
            "作为{physical}的族群，他们展现出{mental}的特质，并形成了{social}的社会。",
            "这个种族具有{physical}的体魄，{mental}的天赋，形成了{social}的文明。",
        ]

        trait_types = ["physical", "mental", "social"]
        selected_traits = {
            t: random_generator.choice(list(traits[t].values()))[0] for t in trait_types
        }

        return random_generator.choice(templates).format(**selected_traits)

    def _generate_creature_name(
        self, creature_type: str, random_generator: random.Random
    ) -> str:
        """生成生物名称"""
        prefixes = {
            "terrestrial": ["地", "山", "林", "沙"],
            "aerial": ["风", "云", "翼", "空"],
            "aquatic": ["水", "波", "渊", "潮"],
            "magical": ["魔", "灵", "幻", "秘"],
        }

        suffixes = ["兽", "龙", "灵", "兽", "妖", "兽"]

        prefix = random_generator.choice(prefixes.get(creature_type, ["奇"]))
        suffix = random_generator.choice(suffixes)

        return f"{prefix}{suffix}"

    def _generate_creature_behavior(self, random_generator: random.Random) -> str:
        """生成生物行为描述"""
        behaviors = [
            "群居性强，具有复杂的社会结构",
            "独居生活，性格温和",
            "具有领地意识，好斗",
            "昼伏夜出，善于捕食",
            "迁徙性强，四处游荡",
            "与同类密切合作",
            "性格谨慎，善于隐藏",
        ]
        return random_generator.choice(behaviors)

    def _generate_creature_significance(self, random_generator: random.Random) -> str:
        """生成生物文化意义"""
        significances = [
            "在当地文化中具有神圣地位",
            "是重要的经济资源",
            "与古老传说有关",
            "对生态系统起着关键作用",
            "被视为吉祥物",
            "是危险的天敌",
            "具有重要的研究价值",
        ]
        return random_generator.choice(significances)

    def _generate_ecosystem_description(
        self, creatures: List[Dict], random_generator: random.Random
    ) -> Dict:
        """生成生态系统描述"""
        return {
            "balance": random_generator.choice(
                [
                    "生态系统平衡而稳定",
                    "正在经历微妙的变化",
                    "面临某些威胁",
                    "展现出强大的适应性",
                ]
            ),
            "interactions": random_generator.choice(
                [
                    "物种之间形成了复杂的互动关系",
                    "各类生物和谐共处",
                    "存在激烈的生存竞争",
                    "呈现出独特的共生关系",
                ]
            ),
            "characteristics": random_generator.choice(
                [
                    "生物多样性丰富",
                    "存在独特的进化现象",
                    "适应性极强",
                    "展现出神奇的魔法特性",
                ]
            ),
        }

    def _generate_systems(
        self,
        random_generator: random.Random,
        complexity: int,
        focus_areas: List[str] = None,
    ) -> Dict:
        """生成魔法/科技系统"""
        systems_data = {}
        focus_areas = focus_areas or []  # 如果没有传入，使用空列表

        # 魔法系统定义
        magic_types = {
            "elemental": "元素魔法",
            "divine": "神圣魔法",
            "natural": "自然魔法",
            "mental": "精神魔法",
            "spatial": "空间魔法",
            "temporal": "时间魔法",
            "life": "生命魔法",
            "death": "死亡魔法",
        }

        magic_sources = {
            "mana": "魔力",
            "spirit": "灵力",
            "nature": "自然之力",
            "soul": "灵魂之力",
            "cosmic": "宇宙能量",
            "divine": "神圣之力",
        }

        magic_principles = [
            "能量守恒",
            "等价交换",
            "意志塑形",
            "自然循环",
            "因果关联",
            "平衡法则",
        ]

        magic_limitations = [
            "施法需要冷却时间",
            "消耗施法者生命力",
            "需要特定媒介",
            "受环境影响",
            "有使用次数限制",
            "可能产生副作用",
        ]

        # 科技系统定义
        tech_categories = {
            "energy": {
                "name": "能源科技",
                "types": ["核能", "太阳能", "暗物质", "反物质", "量子能源"],
            },
            "transportation": {
                "name": "交通科技",
                "types": ["空间跳跃", "反重力", "超音速", "次元穿梭", "量子传送"],
            },
            "communication": {
                "name": "通讯科技",
                "types": ["全息投影", "脑波传输", "量子通讯", "意识链接", "时空通讯"],
            },
            "weapons": {
                "name": "武器科技",
                "types": ["粒子武器", "等离子炮", "引力武器", "相位武器", "时空武器"],
            },
        }

        # 根据复杂度决定是否生成魔法系统
        if random_generator.random() < 0.7 or "magic" in focus_areas:
            magic_system = {
                "types": random_generator.sample(
                    list(magic_types.items()), k=min(4, complexity)
                ),
                "sources": random_generator.sample(
                    list(magic_sources.items()), k=min(3, complexity)
                ),
                "principles": random_generator.sample(
                    magic_principles, k=min(3, complexity)
                ),
                "limitations": random_generator.sample(
                    magic_limitations, k=min(3, complexity)
                ),
                "schools": self._generate_magic_schools(random_generator, complexity),
                "description": self._generate_magic_description(random_generator),
            }
            systems_data["magic"] = magic_system

        # 根据复杂度决定是否生成科技系统
        if random_generator.random() < 0.7 or "technology" in focus_areas:
            tech_system = {
                "categories": {},
                "breakthroughs": self._generate_tech_breakthroughs(
                    random_generator, complexity
                ),
                "description": self._generate_tech_system_description(random_generator),
            }

            # 为每个科技类别生成具体内容
            for category, info in tech_categories.items():
                if random_generator.random() < 0.8:
                    tech_system["categories"][category] = {
                        "name": info["name"],
                        "types": random_generator.sample(
                            info["types"], k=min(3, complexity)
                        ),
                        "development_level": random_generator.randint(1, 10),
                        "description": self._generate_tech_category_description(
                            category, info["name"]
                        ),
                    }

            systems_data["technology"] = tech_system

        return systems_data

    def _generate_magic_schools(
        self, random_generator: random.Random, complexity: int
    ) -> List[Dict]:
        """生成魔法流派"""
        school_templates = [
            {"name": "元素之道", "focus": "操控自然元素", "style": "注重平衡"},
            {"name": "生命学派", "focus": "生命能量", "style": "温和内敛"},
            {"name": "混沌法术", "focus": "能量操控", "style": "狂放不羁"},
            {"name": "秩序之术", "focus": "规则之力", "style": "严谨有序"},
            {"name": "自然之道", "focus": "自然之力", "style": "顺应自然"},
            {"name": "神秘学派", "focus": "未知之力", "style": "深奥难测"},
        ]

        num_schools = min(len(school_templates), max(2, complexity // 2))
        schools = random_generator.sample(school_templates, k=num_schools)

        for school in schools:
            school["techniques"] = self._generate_magic_techniques(
                school["focus"], random_generator, min(5, complexity)
            )

        return schools

    def _generate_magic_techniques(
        self, focus: str, random_generator: random.Random, count: int
    ) -> List[str]:
        """生成魔法技术"""
        technique_templates = {
            "操控自然元素": ["火焰操控", "水流控制", "大地之力", "风暴召唤"],
            "生命能量": ["生命汲取", "治愈之术", "生命链接", "自然共鸣"],
            "能量操控": ["能量爆发", "力场控制", "能量护盾", "混沌之力"],
            "规则之力": ["时空扭曲", "因果操控", "规则重构", "秩序之力"],
            "自然之力": ["自然召唤", "生态操控", "季节转换", "天气掌控"],
            "未知之力": ["虚空探索", "维度之门", "意识操控", "命运之力"],
        }

        base_techniques = technique_templates.get(focus, ["基础法术"])
        return random_generator.sample(
            base_techniques, k=min(len(base_techniques), count)
        )

    def _generate_tech_breakthroughs(
        self, random_generator: random.Random, complexity: int
    ) -> List[Dict]:
        """生成科技突破"""
        breakthrough_templates = [
            {"field": "能源", "impact": "彻底解决了能源危机"},
            {"field": "医疗", "impact": "大幅延长了生命span"},
            {"field": "交通", "impact": "实现了跨星际旅行"},
            {"field": "通信", "impact": "突破了时空通讯限制"},
            {"field": "材料", "impact": "发明了革命性新材料"},
            {"field": "人工智能", "impact": "达到了超人类智能"},
        ]

        num_breakthroughs = min(len(breakthrough_templates), max(1, complexity // 3))
        return random_generator.sample(breakthrough_templates, k=num_breakthroughs)

    def _generate_magic_description(self, random_generator: random.Random) -> str:
        """生成魔法系统描述"""
        templates = [
            "这是一个{adj}的魔法体系，{feature}。",
            "魔法在这个世界中{state}，{impact}。",
            "作为世界的基础力量，魔法{characteristic}。",
        ]

        adjectives = ["神秘", "古老", "强大", "精妙", "和谐"]
        features = [
            "蕴含着无尽的可能",
            "遵循着严格的规则",
            "与自然紧密相连",
            "影响着世界的方方面面",
        ]
        states = ["无处不在", "深入人心", "广泛运用", "自成体系"]
        impacts = [
            "塑造着文明的发展",
            "推动着社会的进步",
            "维持着世界的平衡",
            "创造着无尽的奇迹",
        ]
        characteristics = [
            "展现出惊人的适应性",
            "不断演化出新的形式",
            "保持着神秘的特质",
            "遵循着永恒的法则",
        ]

        template = random_generator.choice(templates)
        if "{adj}" in template and "{feature}" in template:
            return template.format(
                adj=random_generator.choice(adjectives),
                feature=random_generator.choice(features),
            )
        elif "{state}" in template and "{impact}" in template:
            return template.format(
                state=random_generator.choice(states),
                impact=random_generator.choice(impacts),
            )
        else:
            return template.format(
                characteristic=random_generator.choice(characteristics)
            )

    def _generate_tech_system_description(self, random_generator: random.Random) -> str:
        """生成科技系统描述"""
        templates = [
            "这个世界的科技发展{level}，{feature}。",
            "科技文明{state}，{impact}。",
            "在科技领域，这个世界{characteristic}。",
        ]

        levels = ["高度发达", "突飞猛进", "独具特色", "全面发展"]
        features = [
            "创造出令人惊叹的奇迹",
            "改变着人们的生活方式",
            "推动着文明的进步",
            "开拓着新的可能",
        ]
        states = ["蓬勃发展", "稳步前进", "不断创新", "持续突破"]
        impacts = [
            "带来深远的社会变革",
            "开创崭新的发展方向",
            "实现前所未有的突破",
            "塑造全新的文明形态",
        ]

        template = random_generator.choice(templates)
        if "{level}" in template and "{feature}" in template:
            return template.format(
                level=random_generator.choice(levels),
                feature=random_generator.choice(features),
            )
        elif "{state}" in template and "{impact}" in template:
            return template.format(
                state=random_generator.choice(states),
                impact=random_generator.choice(impacts),
            )
        else:
            return template.format(
                characteristic=random_generator.choice(
                    [
                        "展现出独特的发展路径",
                        "实现了多个重大突破",
                        "形成了完整的体系",
                        "创造了惊人的成就",
                    ]
                )
            )

    def _generate_tech_category_description(self, category: str, name: str) -> str:
        """生成科技类别描述"""
        descriptions = {
            "energy": f"{name}高度发达，为文明发展提供源源不断的动力。",
            "transportation": f"{name}突破了空间限制，让跨越距离变得轻而易举。",
            "communication": f"{name}消除了信息壁垒，实现了无障碍的交流。",
            "weapons": f"{name}形成了强大的威慑力，维护着世界的平衡。",
        }
        return descriptions.get(category, f"{name}展现出独特的发展特点。")


@app.post("/api/generate")
async def generate_world(params: WorldGenerationParams):
    try:
        logger.info(f"Received generation request with params: {params}")

        generator = WorldGenerator()
        world_data = generator.generate_world(
            seed=params.seed,
            complexity=params.complexity,
            focus_areas=params.focus_areas,
            **(params.additional_params or {}),
        )

        # 保存到文件系统
        saved_files = file_storage.save_world_data(
            world_data, project_name=params.project_name
        )
        logger.info(f"Saved world data to files: {saved_files}")

        # 在响应中添加文件路径信息
        world_data["files"] = saved_files
        world_data["project"] = params.project_name

        logger.info("World generation successful")
        return world_data

    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Generation error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}


@app.post("/api/analyze")
async def analyze_prompt(params: PromptAnalysis):
    try:
        # 使用结巴分词提取关键词
        keywords = jieba.analyse.extract_tags(params.prompt, topK=10)

        # 分析文本复杂度
        complexity = min(len(params.prompt) // 50 + 3, 10)

        # 识别重点领域
        focus_areas = []
        if any(word in params.prompt for word in ["地理", "地形", "气候", "资源"]):
            focus_areas.append("geography")
        if any(word in params.prompt for word in ["文明", "社会", "科技"]):
            focus_areas.append("civilization")
        if any(word in params.prompt for word in ["历史", "事件", "战争"]):
            focus_areas.append("history")
        if any(word in params.prompt for word in ["文化", "艺术", "习俗"]):
            focus_areas.append("culture")
        if any(word in params.prompt for word in ["宗教", "信仰", "神灵"]):
            focus_areas.append("religion")

        # 生成建议的种子
        suggested_seed = "-".join(keywords[:2]) + f"-{random.randint(1000, 9999)}"

        # 分析世界特征
        analysis = {
            "worldOrigin": _analyze_world_origin(params.prompt),
            "geography": _analyze_geography(params.prompt),
            "civilization": _analyze_civilization(params.prompt),
            "keyThemes": keywords,
        }

        return PromptAnalysisResult(
            suggestedSeed=suggested_seed,
            suggestedComplexity=complexity,
            suggestedFocusAreas=focus_areas,
            analysis=analysis,
        )

    except Exception as e:
        logger.error(f"Analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


def _analyze_world_origin(text: str) -> str:
    if "魔法" in text or "奇幻" in text:
        return "magical"
    elif "科技" in text or "未来" in text:
        return "technological"
    elif "自然" in text or "原始" in text:
        return "natural"
    return "unknown"


def _analyze_geography(text: str) -> str:
    if "浮空" in text or "空中" in text:
        return "floating"
    elif "地下" in text or "洞穴" in text:
        return "underground"
    elif "海洋" in text or "水世界" in text:
        return "oceanic"
    return "standard"


def _analyze_civilization(text: str) -> str:
    if "高科技" in text or "未来" in text:
        return "advanced"
    elif "中世纪" in text or "古代" in text:
        return "medieval"
    elif "原始" in text or "蛮荒" in text:
        return "primitive"
    return "standard"


@app.get("/api/worlds/{project_name}/{world_id}")
async def get_world(project_name: str, world_id: str):
    try:
        # 从文件系统加载世界数据
        world_path = os.path.join(
            file_storage.base_path, project_name, "worlds", world_id
        )
        if not os.path.exists(world_path):
            raise HTTPException(status_code=404, detail="世界不存在")

        # 读取完整数据
        with open(
            os.path.join(world_path, "完整数据.json"), "r", encoding="utf-8"
        ) as f:
            world_data = json.load(f)

        return world_data

    except Exception as e:
        logger.error(f"Error loading world data: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.patch("/api/worlds/{project_name}/{world_id}")
async def update_world(project_name: str, world_id: str, updates: Dict[str, Any]):
    try:
        # 从文件系统加载现有数据
        world_path = os.path.join(
            file_storage.base_path, project_name, "worlds", world_id
        )
        if not os.path.exists(world_path):
            raise HTTPException(status_code=404, detail="世界不存在")

        # 读取完整数据
        with open(
            os.path.join(world_path, "完整数据.json"), "r", encoding="utf-8"
        ) as f:
            world_data = json.load(f)

        # 应用更新
        for key, value in updates.items():
            if key.startswith("data."):
                # 处理嵌套更新，如 "data.geography.terrain"
                parts = key.split(".")
                target = world_data
                for part in parts[:-1]:
                    target = target[part]
                target[parts[-1]] = value
            else:
                world_data[key] = value

        # 保存更新后的数据
        saved_files = file_storage.save_world_data(world_data, project_name)

        return {"status": "success", "files": saved_files}

    except Exception as e:
        logger.error(f"Error updating world data: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/worlds/{project_name}")
async def list_worlds(project_name: str):
    try:
        # 读取项目索引
        index_path = os.path.join(
            file_storage.base_path, project_name, "project_index.json"
        )
        if not os.path.exists(index_path):
            return {"worlds": []}  # 返回空列表

        with open(index_path, "r", encoding="utf-8") as f:
            index_data = json.load(f)

        worlds = index_data.get("worlds", [])  # 默认返回空列表
        return {"worlds": worlds}

    except Exception as e:
        logger.error(f"Error listing worlds: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/api/worlds/{project_name}/{world_id}")
async def delete_world(project_name: str, world_id: str):
    try:
        # 删除世界数据及其索引
        file_storage.delete_world(project_name, world_id)
        return {"status": "success", "message": "世界已删除"}

    except Exception as e:
        logger.error(f"Error deleting world: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.options("/{full_path:path}")
async def options_handler(request: Request):
    return JSONResponse(status_code=200, content={"status": "ok"})


if __name__ == "__main__":
    logger.info("Starting Virtual World Generator API")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
