import json
import os
from datetime import datetime
import shutil


def create_directory(path):
    if not os.path.exists(path):
        os.makedirs(path)


def create_default_files():
    # 创建必要的目录
    base_dir = os.path.join("..", "novel")
    create_directory(base_dir)
    create_directory(os.path.join(base_dir, "default_project"))
    create_directory(os.path.join(base_dir, "default_project", "worlds"))

    # 创建 worlds_index.json
    worlds_index = {
        "version": "1.0",
        "worlds": [
            {
                "id": "default_world",
                "name": "默认世界",
                "description": "这是一个基础的虚拟世界模板",
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat(),
            }
        ],
    }

    with open(os.path.join(base_dir, "worlds_index.json"), "w", encoding="utf-8") as f:
        json.dump(worlds_index, f, ensure_ascii=False, indent=2)

    # 创建 project_index.json
    project_index = {
        "version": "1.0",
        "project_id": "default_project",
        "name": "默认项目",
        "description": "这是一个基础的项目模板",
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
        "worlds": ["default_world"],
        "settings": {"language": "zh-CN", "theme": "default"},
    }

    with open(
        os.path.join(base_dir, "default_project", "project_index.json"),
        "w",
        encoding="utf-8",
    ) as f:
        json.dump(project_index, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    create_default_files()
    print("项目初始化完成！")
