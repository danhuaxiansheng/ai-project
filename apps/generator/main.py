from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
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

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(title="虚拟世界生成器 API")

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 初始化文件存储
file_storage = FileStorage()

class WorldGenerationParams(BaseModel):
    seed: Optional[str] = None
    complexity: int
    focus_areas: List[str]
    additional_params: Optional[dict] = None
    project_name: Optional[str] = None  # 添加项目名称参数

    @validator('complexity')
    def validate_complexity(cls, v):
        if not 1 <= v <= 10:
            raise ValueError("复杂度必须在1到10之间")
        return v

    @validator('focus_areas')
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
    def generate_world(self, seed: Optional[str], complexity: int, focus_areas: List[str], **kwargs) -> Dict:
        try:
            # 如果没有提供种子，生成一个随机种子
            if not seed:
                seed = hashlib.md5(str(random.random()).encode()).hexdigest()[:8]
            
            # 使用种子初始化随机数生成器
            random_generator = random.Random(seed)
            
            logger.info(f"Generating world with seed: {seed}")
            
            # 获取提示词
            prompt = kwargs.get("prompt", "")
            
            # 生成世界ID
            world_id = f"world-{seed}"
            
            # 使用固定的种子生成世界内容
            return {
                "id": world_id,
                "version": "1.0.0",
                "timestamp": datetime.now().isoformat(),
                "seed": seed,
                "name": f"世界-{seed[:6]}",  # 添加默认名称
                "description": prompt or "这是一个新生成的世界",  # 使用提示词作为描述
                "tags": focus_areas,  # 使用重点领域作为标签
                "created_at": datetime.now().isoformat(),  # 添加创建时间
                "data": {
                    "geography": self._generate_geography(random_generator),
                    "civilization": self._generate_civilization(random_generator),
                    "history": self._generate_history(random_generator, complexity)
                }
            }
        except Exception as e:
            logger.error(f"World generation error: {str(e)}")
            raise

    def _generate_geography(self, random_generator: random.Random) -> Dict:
        terrains = ["mountainous", "plains", "coastal", "desert", "forest"]
        climates = ["temperate", "tropical", "arctic", "mediterranean", "continental"]
        
        return {
            "terrain": random_generator.choice(terrains),
            "climate": random_generator.choice(climates)
        }

    def _generate_civilization(self, random_generator: random.Random) -> Dict:
        # 定义可能的技术水平
        tech_levels = [
            "primitive",      # 原始
            "medieval",       # 中世纪
            "renaissance",    # 文艺复兴
            "industrial",     # 工业化
            "modern",        # 现代
            "futuristic",    # 未来
            "magical"        # 魔法文明
        ]
        
        # 定义可能的社会结构
        social_structures = [
            "tribal",        # 部落制
            "feudal",        # 封建制
            "monarchy",      # 君主制
            "republic",      # 共和制
            "democracy",     # 民主制
            "technocracy",   # 技术官僚制
            "theocracy"      # 神权制
        ]
        
        # 定义主要产业
        industries = [
            "agriculture",   # 农业
            "commerce",      # 商业
            "crafting",      # 手工业
            "mining",        # 采矿业
            "magic",         # 魔法产业
            "technology",    # 科技产业
            "education"      # 教育产业
        ]
        
        # 生成文明特征
        return {
            "technology_level": random_generator.choice(tech_levels),
            "social_structure": random_generator.choice(social_structures),
            "major_industries": random_generator.sample(industries, k=3),
            "population_size": random_generator.randint(1000, 1000000),
            "development_level": random_generator.randint(1, 10),
            "cultural_traits": {
                "values": ["honor", "wisdom", "progress"][random_generator.randint(0, 2)],
                "beliefs": ["spiritual", "rational", "balanced"][random_generator.randint(0, 2)],
                "customs": ["traditional", "progressive", "mixed"][random_generator.randint(0, 2)]
            }
        }

    def _generate_history(self, random_generator: random.Random, complexity: int) -> List[Dict]:
        events = []
        num_events = max(1, complexity // 2)  # 根据复杂度生成事件数量
        
        for i in range(num_events):
            year = random_generator.randint(-1000, 2000)
            events.append({
                "year": year,
                "event": f"历史事件 {i+1}"
            })
        
        return sorted(events, key=lambda x: x["year"])

@app.post("/api/generate")
async def generate_world(params: WorldGenerationParams):
    try:
        logger.info(f"Received generation request with params: {params}")
        
        generator = WorldGenerator()
        world_data = generator.generate_world(
            seed=params.seed,
            complexity=params.complexity,
            focus_areas=params.focus_areas,
            **(params.additional_params or {})
        )
        
        # 保存到文件系统
        saved_files = file_storage.save_world_data(
            world_data,
            project_name=params.project_name
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
            "keyThemes": keywords
        }
        
        return PromptAnalysisResult(
            suggestedSeed=suggested_seed,
            suggestedComplexity=complexity,
            suggestedFocusAreas=focus_areas,
            analysis=analysis
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
        world_path = os.path.join(file_storage.base_path, project_name, "worlds", world_id)
        if not os.path.exists(world_path):
            raise HTTPException(status_code=404, detail="世界不存在")

        # 读取完整数据
        with open(os.path.join(world_path, "完整数据.json"), 'r', encoding='utf-8') as f:
            world_data = json.load(f)

        return world_data

    except Exception as e:
        logger.error(f"Error loading world data: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.patch("/api/worlds/{project_name}/{world_id}")
async def update_world(project_name: str, world_id: str, updates: Dict[str, Any]):
    try:
        # 从文件系统加载现有数据
        world_path = os.path.join(file_storage.base_path, project_name, "worlds", world_id)
        if not os.path.exists(world_path):
            raise HTTPException(status_code=404, detail="世界不存在")

        # 读取完整数据
        with open(os.path.join(world_path, "完整数据.json"), 'r', encoding='utf-8') as f:
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
        index_path = os.path.join(file_storage.base_path, project_name, "project_index.json")
        if not os.path.exists(index_path):
            return {"worlds": []}

        with open(index_path, 'r', encoding='utf-8') as f:
            index_data = json.load(f)

        return {"worlds": index_data.get("worlds", {})}

    except Exception as e:
        logger.error(f"Error listing worlds: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/worlds/{project_name}/{world_id}")
async def delete_world(project_name: str, world_id: str):
    try:
        # 从文件系统删除世界数据
        world_path = os.path.join(file_storage.base_path, project_name, "worlds", world_id)
        if not os.path.exists(world_path):
            raise HTTPException(status_code=404, detail="世界不存在")

        # 删除世界文件夹及其内容
        shutil.rmtree(world_path)
        
        # 更新项目索引
        index_path = os.path.join(file_storage.base_path, project_name, "project_index.json")
        if os.path.exists(index_path):
            with open(index_path, 'r', encoding='utf-8') as f:
                index_data = json.load(f)
            
            # 从索引中移除世界
            if "worlds" in index_data and world_id in index_data["worlds"]:
                del index_data["worlds"][world_id]
                
                # 保存更新后的索引
                with open(index_path, 'w', encoding='utf-8') as f:
                    json.dump(index_data, f, ensure_ascii=False, indent=2)

        return {"status": "success", "message": "世界已删除"}

    except Exception as e:
        logger.error(f"Error deleting world: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    logger.info("Starting Virtual World Generator API")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 