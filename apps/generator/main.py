from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import uvicorn
import logging
from datetime import datetime

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

# 模拟 WorldGenerator 类（临时）
class WorldGenerator:
    def generate_world(self, seed: Optional[str], complexity: int, focus_areas: List[str], **kwargs) -> Dict:
        logger.info(f"Generating world with seed: {seed}, complexity: {complexity}, focus_areas: {focus_areas}")
        
        # 模拟生成结果
        return {
            "id": "test-123",
            "version": "1.0.0",
            "timestamp": datetime.now().isoformat(),
            "data": {
                "geography": {
                    "terrain": "mountainous",
                    "climate": "temperate"
                },
                "civilization": {
                    "technology_level": "medieval",
                    "social_structure": "feudal"
                },
                "history": [
                    {
                        "year": 0,
                        "event": "World Creation"
                    }
                ]
            }
        }

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

if __name__ == "__main__":
    logger.info("Starting Virtual World Generator API")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 