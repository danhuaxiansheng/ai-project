import os
import json
from datetime import datetime
from typing import Dict, Any, Optional

class FileStorage:
    def __init__(self, base_path: str = "../novel"):
        self.base_path = os.path.abspath(base_path)
        os.makedirs(self.base_path, exist_ok=True)

    def save_world_data(self, world_data: Dict[str, Any], project_name: Optional[str] = None) -> Dict[str, str]:
        """保存世界设定数据到文件系统"""
        world_id = world_data["id"]
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # 如果没有指定项目名，使用默认项目
        project_name = project_name or "default_project"
        project_path = os.path.join(self.base_path, project_name)
        world_path = os.path.join(project_path, "worlds", world_id)
        
        # 创建必要的目录
        os.makedirs(project_path, exist_ok=True)
        os.makedirs(os.path.join(project_path, "worlds"), exist_ok=True)
        os.makedirs(world_path, exist_ok=True)

        # 定义要保存的文件
        files = {
            "基础信息.json": {
                "id": world_data["id"],
                "seed": world_data["seed"],
                "version": world_data["version"],
                "timestamp": world_data["timestamp"],
                "project": project_name
            },
            "地理环境.json": world_data["data"]["geography"],
            "文明发展.json": world_data["data"]["civilization"],
            "历史事件.json": world_data["data"]["history"],
            "完整数据.json": world_data
        }

        # 保存所有文件
        saved_files = {}
        for filename, content in files.items():
            file_path = os.path.join(world_path, filename)
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(content, f, ensure_ascii=False, indent=2)
            saved_files[filename] = file_path

        # 更新项目索引
        self._update_project_index(project_name, world_id, world_data, timestamp, world_path)
        
        # 更新全局索引
        self._update_global_index(project_name, world_id, world_data, timestamp)

        return saved_files

    def _update_project_index(self, project_name: str, world_id: str, 
                            world_data: Dict, timestamp: str, world_path: str):
        """更新项目级别的索引"""
        index_path = os.path.join(self.base_path, project_name, "project_index.json")
        index_data = self._load_or_create_index(index_path)
        
        # 更新世界信息
        index_data["worlds"] = index_data.get("worlds", {})
        index_data["worlds"][world_id] = {
            "created_at": timestamp,
            "seed": world_data["seed"],
            "path": world_path,
            "name": world_data.get("name", f"世界-{world_id}"),
            "description": world_data.get("description", ""),
            "tags": world_data.get("tags", [])
        }
        
        # 保存项目索引
        with open(index_path, 'w', encoding='utf-8') as f:
            json.dump(index_data, f, ensure_ascii=False, indent=2)

    def _update_global_index(self, project_name: str, world_id: str, 
                           world_data: Dict, timestamp: str):
        """更新全局索引"""
        index_path = os.path.join(self.base_path, "worlds_index.json")
        index_data = self._load_or_create_index(index_path)
        
        # 更新项目信息
        index_data["projects"] = index_data.get("projects", {})
        if project_name not in index_data["projects"]:
            index_data["projects"][project_name] = {
                "created_at": timestamp,
                "worlds": []
            }
        
        # 添加世界引用
        world_ref = {
            "id": world_id,
            "created_at": timestamp,
            "seed": world_data["seed"]
        }
        if world_ref not in index_data["projects"][project_name]["worlds"]:
            index_data["projects"][project_name]["worlds"].append(world_ref)
        
        # 保存全局索引
        with open(index_path, 'w', encoding='utf-8') as f:
            json.dump(index_data, f, ensure_ascii=False, indent=2)

    def _load_or_create_index(self, index_path: str) -> Dict:
        """加载或创建索引文件"""
        if os.path.exists(index_path):
            with open(index_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        return {} 