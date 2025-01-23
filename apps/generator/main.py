from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import uvicorn
import logging
from datetime import datetime
import random
import hashlib
import re
import jieba
import jieba.analyse

# 配置日志
logging.basicConfig(level=logging.INFO)
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

class WorldGenerationParams(BaseModel):
    seed: Optional[str] = None
    complexity: int
    focus_areas: List[str]
    additional_params: Optional[dict] = None

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
        # 如果没有提供种子，生成一个随机种子
        if not seed:
            seed = hashlib.md5(str(random.random()).encode()).hexdigest()[:8]
        
        # 使用种子初始化随机数生成器
        random_generator = random.Random(seed)
        
        logger.info(f"Generating world with seed: {seed}")
        
        # 使用固定的种子生成世界内容
        return {
            "id": f"world-{seed}",
            "version": "1.0.0",
            "timestamp": datetime.now().isoformat(),
            "seed": seed,  # 返回使用的种子
            "data": {
                "geography": self._generate_geography(random_generator),
                "civilization": self._generate_civilization(random_generator),
                "history": self._generate_history(random_generator)
            }
        }

    def _generate_geography(self, random_generator: random.Random) -> Dict:
        terrains = ["mountainous", "plains", "coastal", "desert", "forest"]
        climates = ["temperate", "tropical", "arctic", "mediterranean", "continental"]
        
        return {
            "terrain": random_generator.choice(terrains),
            "climate": random_generator.choice(climates)
        }

    # ... 其他生成方法类似

@app.post("/api/generate")
async def generate_world(params: WorldGenerationParams):
    try:
        logger.info(f"Received generation request with params: {params}")
        
        # 参数验证
        if params.complexity < 1 or params.complexity > 10:
            raise ValueError("Complexity must be between 1 and 10")
        
        if not params.focus_areas:
            raise ValueError("At least one focus area must be specified")
        
        generator = WorldGenerator()
        world_data = generator.generate_world(
            seed=params.seed,
            complexity=params.complexity,
            focus_areas=params.focus_areas,
            **(params.additional_params or {})
        )
        
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

if __name__ == "__main__":
    logger.info("Starting Virtual World Generator API")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 