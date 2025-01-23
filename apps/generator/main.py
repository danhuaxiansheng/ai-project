from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

from core.virtual_world_generator import WorldGenerator

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

@app.post("/api/generate")
async def generate_world(params: WorldGenerationParams):
    try:
        generator = WorldGenerator()
        world_data = generator.generate_world(
            seed=params.seed,
            complexity=params.complexity,
            focus_areas=params.focus_areas,
            **params.additional_params or {}
        )
        return world_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 