from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator
from typing import List, Optional, Dict
import logging
from datetime import datetime
import jieba
import random
import jieba.analyse

from virtual_world_generator import VirtualWorldGenerator
from utils.file_storage import FileStorage

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
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# 初始化文件存储
file_storage = FileStorage()


class WorldGenerationParams(BaseModel):
    seed: Optional[str] = None
    complexity: int
    focus_areas: List[str]
    additional_params: Optional[dict] = None
    project_name: Optional[str] = None

    @field_validator("complexity")
    @classmethod
    def validate_complexity(cls, v: int) -> int:
        if not 1 <= v <= 10:
            raise ValueError("复杂度必须在1到10之间")
        return v

    @field_validator("focus_areas")
    @classmethod
    def validate_focus_areas(cls, v: List[str]) -> List[str]:
        valid_areas = {"geography", "civilization", "history", "culture", "religion"}
        if not v:
            raise ValueError("至少需要选择一个重点领域")
        if not all(area in valid_areas for area in v):
            raise ValueError("包含无效的重点领域")
        return v


@app.post("/api/generate")
async def generate_world(params: WorldGenerationParams):
    try:
        logger.info(f"Received generation request with params: {params}")

        # 创建生成器实例并生成世界
        generator = VirtualWorldGenerator(
            seed=params.seed,
            complexity=params.complexity,
            focus_areas=params.focus_areas,
            additional_params=params.additional_params,
        )

        world_data = await generator.generate_world()

        # 保存世界数据
        storage = FileStorage()
        world_id = storage.save_world(
            world_data, params.project_name or "default_project"
        )
        world_data["id"] = world_id

        return world_data

    except Exception as e:
        logger.error(f"Generation error: {str(e)}")
        logger.exception("详细错误信息：")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}


@app.get("/api/worlds/{project_name}")
async def list_worlds(project_name: str):
    """获取指定项目的世界列表"""
    try:
        worlds = file_storage.list_worlds(project_name)
        return {"worlds": worlds}
    except Exception as e:
        logger.error(f"Error listing worlds: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/worlds/{project_name}/{world_id}")
async def get_world(project_name: str, world_id: str):
    """获取指定世界的详细信息"""
    try:
        world_data = file_storage.get_world(project_name, world_id)
        return world_data
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error getting world: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/api/worlds/{project_name}/{world_id}")
async def delete_world(project_name: str, world_id: str):
    """删除指定的世界"""
    try:
        file_storage.delete_world(project_name, world_id)
        return {"status": "success", "message": "世界已删除"}
    except Exception as e:
        logger.error(f"Error deleting world: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# 添加分析请求的模型
class PromptAnalysis(BaseModel):
    prompt: str


class PromptAnalysisResult(BaseModel):
    suggestedSeed: Optional[str] = None
    suggestedComplexity: Optional[int] = None
    suggestedFocusAreas: Optional[List[str]] = None
    analysis: Dict = {}


@app.post("/api/analyze")
async def analyze_prompt(params: PromptAnalysis):
    """分析提示词，提供生成建议"""
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
    """分析世界起源类型"""
    if "魔法" in text or "奇幻" in text:
        return "magical"
    elif "科技" in text or "未来" in text:
        return "technological"
    elif "自然" in text or "原始" in text:
        return "natural"
    return "unknown"


def _analyze_geography(text: str) -> str:
    """分析地理特征"""
    if "浮空" in text or "空中" in text:
        return "floating"
    elif "地下" in text or "洞穴" in text:
        return "underground"
    elif "海洋" in text or "水世界" in text:
        return "oceanic"
    return "standard"


def _analyze_civilization(text: str) -> str:
    """分析文明类型"""
    if "高科技" in text or "未来" in text:
        return "advanced"
    elif "中世纪" in text or "古代" in text:
        return "medieval"
    elif "原始" in text or "蛮荒" in text:
        return "primitive"
    return "standard"


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
