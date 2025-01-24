import os
import json
from datetime import datetime
from typing import Dict, Any, Optional
import shutil
import logging

logger = logging.getLogger(__name__)


class FileStorage:
    def __init__(self, base_path: str = "../novel"):
        self.base_path = os.path.abspath(base_path)
        self.worlds_index_path = os.path.join(self.base_path, "worlds_index.json")
        os.makedirs(self.base_path, exist_ok=True)
        self._ensure_files_exist()

    def _ensure_files_exist(self):
        """确保必要的文件和目录存在"""
        if not os.path.exists(self.worlds_index_path):
            with open(self.worlds_index_path, "w", encoding="utf-8") as f:
                json.dump({"worlds": {}}, f, ensure_ascii=False, indent=2)

    def save_world(self, world_data: Dict[str, Any], project_name: str) -> str:
        """保存世界数据并返回世界ID"""
        # 确保项目结构存在
        self._ensure_project_structure(project_name)

        # 生成世界ID
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        world_id = f"world_{timestamp}"

        # 设置基础路径
        project_path = os.path.join(self.base_path, project_name)
        world_path = os.path.join(project_path, "worlds", world_id)

        # 创建必要的目录
        os.makedirs(project_path, exist_ok=True)
        os.makedirs(os.path.join(project_path, "worlds"), exist_ok=True)
        os.makedirs(world_path, exist_ok=True)

        # 准备世界数据
        world_data["id"] = world_id
        world_data["created_at"] = datetime.now().isoformat()
        world_data["project_name"] = project_name

        # 定义要保存的文件结构
        files = {
            "基础信息.json": {
                "id": world_id,
                "seed": world_data.get("seed", ""),
                "created_at": world_data["created_at"],
                "project_name": project_name,
                "name": world_data.get("name", f"世界-{world_id}"),
                "description": world_data.get("description", ""),
                "tags": world_data.get("tags", []),
            },
            "地理环境.json": world_data.get("content", {}).get("geography", {}),
            "文明发展.json": world_data.get("content", {}).get("civilization", {}),
            "历史事件.json": world_data.get("content", {}).get("history", {}),
            "完整数据.json": world_data,
        }

        # 保存文件
        for filename, content in files.items():
            file_path = os.path.join(world_path, filename)
            with open(file_path, "w", encoding="utf-8") as f:
                json.dump(content, f, ensure_ascii=False, indent=2)

        # 更新索引
        self._update_indexes(world_data, project_name, world_id, world_path)

        return world_id

    def _update_indexes(
        self,
        world_data: Dict[str, Any],
        project_name: str,
        world_id: str,
        world_path: str,
    ):
        """统一更新索引文件"""
        # 更新全局索引
        with open(self.worlds_index_path, "r+", encoding="utf-8") as f:
            index = json.load(f)
            index["worlds"][world_id] = {
                "id": world_id,
                "project_name": project_name,
                "created_at": world_data["created_at"],
                "name": world_data.get("name", f"世界-{world_id}"),
                "seed": world_data.get("seed", ""),
                "path": world_path,
            }
            f.seek(0)
            json.dump(index, f, ensure_ascii=False, indent=2)
            f.truncate()

        # 更新项目索引
        project_index_path = os.path.join(
            self.base_path, project_name, "project_index.json"
        )
        project_index = self._load_or_create_index(project_index_path)

        project_index["worlds"] = project_index.get("worlds", {})
        project_index["worlds"][world_id] = {
            "id": world_id,
            "created_at": world_data["created_at"],
            "name": world_data.get("name", f"世界-{world_id}"),
            "seed": world_data.get("seed", ""),
            "path": world_path,
            "description": world_data.get("description", ""),
            "tags": world_data.get("tags", []),
        }

        with open(project_index_path, "w", encoding="utf-8") as f:
            json.dump(project_index, f, ensure_ascii=False, indent=2)

    def delete_world(self, project_name: str, world_id: str) -> None:
        """删除世界数据及其相关索引"""
        try:
            # 1. 删除世界文件夹
            world_path = os.path.join(self.base_path, project_name, "worlds", world_id)
            if os.path.exists(world_path):
                shutil.rmtree(world_path)

            # 2. 从全局索引中删除
            with open(self.worlds_index_path, "r+", encoding="utf-8") as f:
                index = json.load(f)
                if world_id in index["worlds"]:
                    del index["worlds"][world_id]
                f.seek(0)
                json.dump(index, f, ensure_ascii=False, indent=2)
                f.truncate()

            # 3. 从项目索引中删除
            project_index_path = os.path.join(
                self.base_path, project_name, "project_index.json"
            )
            if os.path.exists(project_index_path):
                with open(project_index_path, "r+", encoding="utf-8") as f:
                    project_index = json.load(f)
                    if (
                        "worlds" in project_index
                        and world_id in project_index["worlds"]
                    ):
                        del project_index["worlds"][world_id]
                    f.seek(0)
                    json.dump(project_index, f, ensure_ascii=False, indent=2)
                    f.truncate()

        except Exception as e:
            raise Exception(f"删除世界失败: {str(e)}")

    def get_world(self, project_name: str, world_id: str) -> Dict[str, Any]:
        """获取世界数据"""
        try:
            world_path = os.path.join(
                self.base_path, project_name, "worlds", world_id, "完整数据.json"
            )
            if not os.path.exists(world_path):
                raise FileNotFoundError(f"找不到世界数据: {world_path}")

            with open(world_path, "r", encoding="utf-8") as f:
                return json.load(f)

        except Exception as e:
            logger.error(f"获取世界数据失败: {str(e)}")
            raise

    def list_worlds(self, project_name: str) -> Dict[str, Any]:
        """列出指定项目的所有世界"""
        try:
            project_index_path = os.path.join(
                self.base_path, project_name, "project_index.json"
            )
            if not os.path.exists(project_index_path):
                # 如果项目不存在，返回空列表
                return {}

            with open(project_index_path, "r", encoding="utf-8") as f:
                project_data = json.load(f)
                return project_data.get("worlds", {})

        except Exception as e:
            logger.error(f"列出世界失败: {str(e)}")
            raise

    def _load_or_create_index(self, index_path: str) -> Dict:
        """加载或创建索引文件"""
        if os.path.exists(index_path):
            with open(index_path, "r", encoding="utf-8") as f:
                return json.load(f)
        return {}

    def _ensure_project_structure(self, project_name: str):
        """确保项目结构存在"""
        project_path = os.path.join(self.base_path, project_name)
        worlds_path = os.path.join(project_path, "worlds")
        index_path = os.path.join(project_path, "project_index.json")

        # 创建必要的目录
        os.makedirs(project_path, exist_ok=True)
        os.makedirs(worlds_path, exist_ok=True)

        # 确保索引文件存在
        if not os.path.exists(index_path):
            with open(index_path, "w", encoding="utf-8") as f:
                json.dump({"worlds": {}}, f, ensure_ascii=False, indent=2)
