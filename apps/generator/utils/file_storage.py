import os
import json
import uuid
from datetime import datetime
from typing import Dict, Any, List
import shutil
import logging

logger = logging.getLogger(__name__)


class FileStorage:
    """文件存储管理类"""

    def __init__(self):
        """初始化存储系统"""
        # 修正基础目录路径
        current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.base_dir = os.path.join(current_dir, "data", "worlds")  # 使用相对路径
        self.worlds_index_path = os.path.join(self.base_dir, "worlds_index.json")
        self.default_project = "default_project"

        # 确保必要的目录和文件存在
        self._ensure_storage_structure()
        logger.info(f"存储系统初始化完成，基础目录: {self.base_dir}")

    def _ensure_storage_structure(self):
        """确保存储结构完整"""
        try:
            # 创建基础目录
            os.makedirs(self.base_dir, exist_ok=True)
            logger.info(f"确保基础目录存在: {self.base_dir}")

            # 确保世界索引文件存在
            if not os.path.exists(self.worlds_index_path):
                self._create_worlds_index()
                logger.info(f"创建世界索引文件: {self.worlds_index_path}")

            # 确保默认项目目录存在
            default_project_dir = os.path.join(self.base_dir, self.default_project)
            os.makedirs(default_project_dir, exist_ok=True)
            logger.info(f"确保默认项目目录存在: {default_project_dir}")

            # 确保默认项目配置文件存在
            project_config_path = os.path.join(
                default_project_dir, "project_index.json"
            )
            if not os.path.exists(project_config_path):
                self._create_project_config(self.default_project)
                logger.info(f"创建项目配置文件: {project_config_path}")

        except Exception as e:
            logger.error(f"创建存储结构失败: {str(e)}")
            raise

    def _create_worlds_index(self):
        """创建世界索引文件"""
        with open(self.worlds_index_path, "w", encoding="utf-8") as f:
            json.dump(
                {"projects": [self.default_project]}, f, ensure_ascii=False, indent=2
            )

    def _create_project_config(self, project_name: str):
        """创建项目配置文件"""
        config_path = os.path.join(self.base_dir, project_name, "project_index.json")
        with open(config_path, "w", encoding="utf-8") as f:
            json.dump(
                {
                    "name": project_name,
                    "created_at": datetime.now().isoformat(),
                    "worlds": [],
                },
                f,
                ensure_ascii=False,
                indent=2,
            )

    def save_world(
        self, world_data: Dict, project_name: str = "default_project"
    ) -> str:
        """保存世界数据"""
        try:
            # 生成唯一ID
            world_id = str(uuid.uuid4())

            # 确保项目目录存在
            project_dir = os.path.join(self.base_dir, project_name)
            worlds_dir = os.path.join(project_dir, "worlds")
            os.makedirs(worlds_dir, exist_ok=True)

            # 保存世界数据
            world_path = os.path.join(worlds_dir, f"{world_id}.json")
            with open(world_path, "w", encoding="utf-8") as f:
                json.dump(world_data, f, ensure_ascii=False, indent=2)

            # 更新项目索引
            self._update_project_index(project_name, world_id, world_data)

            logger.info(f"成功保存世界 {world_id} 到项目 {project_name}")
            return world_id

        except Exception as e:
            logger.error(f"保存世界数据失败: {str(e)}")
            raise

    def get_world(self, project_name: str, world_id: str) -> Dict[str, Any]:
        """获取世界数据"""
        try:
            world_path = os.path.join(
                self.base_dir, project_name, "worlds", f"{world_id}.json"
            )
            if not os.path.exists(world_path):
                raise FileNotFoundError(f"找不到世界数据: {world_path}")

            with open(world_path, "r", encoding="utf-8") as f:
                return json.load(f)

        except Exception as e:
            logger.error(f"获取世界数据失败: {str(e)}")
            raise

    def delete_world(self, project_name: str, world_id: str) -> None:
        """删除世界数据及其相关索引"""
        try:
            # 1. 删除世界文件
            world_path = os.path.join(
                self.base_dir, project_name, "worlds", f"{world_id}.json"
            )
            if os.path.exists(world_path):
                os.remove(world_path)
                logger.info(f"删除世界文件: {world_path}")

            # 2. 从项目索引中删除
            project_index_path = os.path.join(
                self.base_dir, project_name, "project_index.json"
            )
            if os.path.exists(project_index_path):
                with open(project_index_path, "r+", encoding="utf-8") as f:
                    project_index = json.load(f)
                    project_index["worlds"] = [
                        w for w in project_index["worlds"] if w["id"] != world_id
                    ]
                    f.seek(0)
                    json.dump(project_index, f, ensure_ascii=False, indent=2)
                    f.truncate()
                logger.info(f"从项目索引中删除世界: {world_id}")

        except Exception as e:
            logger.error(f"删除世界失败: {str(e)}")
            raise

    def list_worlds(self, project_name: str) -> List[Dict[str, Any]]:
        """列出指定项目的所有世界"""
        try:
            project_index_path = os.path.join(
                self.base_dir, project_name, "project_index.json"
            )
            if not os.path.exists(project_index_path):
                logger.warning(f"项目不存在: {project_name}")
                return []

            with open(project_index_path, "r", encoding="utf-8") as f:
                project_data = json.load(f)
                return project_data.get("worlds", [])

        except Exception as e:
            logger.error(f"列出世界失败: {str(e)}")
            raise

    def _update_project_index(self, project_name: str, world_id: str, world_data: Dict):
        """更新项目索引"""
        try:
            project_index_path = os.path.join(
                self.base_dir, project_name, "project_index.json"
            )

            with open(project_index_path, "r+", encoding="utf-8") as f:
                project_index = json.load(f)

                # 添加世界信息到索引
                world_info = {
                    "id": world_id,
                    "name": f"世界-{world_id[:8]}",
                    "created_at": datetime.now().isoformat(),
                    "description": world_data.get("description", ""),
                    "seed": world_data.get("seed", ""),
                    "complexity": world_data.get("complexity", 1),
                }

                if "worlds" not in project_index:
                    project_index["worlds"] = []

                project_index["worlds"].append(world_info)

                f.seek(0)
                json.dump(project_index, f, ensure_ascii=False, indent=2)
                f.truncate()

            logger.info(f"更新项目索引: {project_name}, 世界ID: {world_id}")

        except Exception as e:
            logger.error(f"更新项目索引失败: {str(e)}")
            raise

    def _ensure_files_exist(self):
        """确保必要的文件和目录存在"""
        if not os.path.exists(self.worlds_index_path):
            with open(self.worlds_index_path, "w", encoding="utf-8") as f:
                json.dump({"worlds": {}}, f, ensure_ascii=False, indent=2)

    def _load_or_create_index(self, index_path: str) -> Dict:
        """加载或创建索引文件"""
        if os.path.exists(index_path):
            with open(index_path, "r", encoding="utf-8") as f:
                return json.load(f)
        return {}

    def _ensure_project_structure(self, project_name: str):
        """确保项目结构存在"""
        project_path = os.path.join(self.base_dir, project_name)
        worlds_path = os.path.join(project_path, "worlds")
        index_path = os.path.join(project_path, "project_index.json")

        # 创建必要的目录
        os.makedirs(project_path, exist_ok=True)
        os.makedirs(worlds_path, exist_ok=True)

        # 确保索引文件存在
        if not os.path.exists(index_path):
            with open(index_path, "w", encoding="utf-8") as f:
                json.dump({"worlds": {}}, f, ensure_ascii=False, indent=2)
