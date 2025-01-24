import logging
import os
from logging.handlers import RotatingFileHandler


def setup_logger():
    """配置日志系统"""
    log_level = os.getenv("LOG_LEVEL", "INFO")
    log_format = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

    # 创建日志目录
    os.makedirs("logs", exist_ok=True)

    # 配置根日志器
    logging.basicConfig(
        level=log_level,
        format=log_format,
        handlers=[
            RotatingFileHandler(
                "logs/app.log", maxBytes=10 * 1024 * 1024, backupCount=5  # 10MB
            ),
            logging.StreamHandler(),
        ],
    )
