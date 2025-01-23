import subprocess
import sys
import locale
import os
import platform

# 使用阿里云镜像源
MIRROR_URL = "https://mirrors.aliyun.com/pypi/simple"
MIRROR_HOST = "mirrors.aliyun.com"

def get_python_version():
    """获取Python版本信息"""
    return f"{sys.version_info.major}{sys.version_info.minor}"

def install_package(package, extra_args=None):
    """安装单个包"""
    try:
        cmd = [
            sys.executable,
            "-m",
            "pip",
            "install",
            "-i", MIRROR_URL,
            "--trusted-host", MIRROR_HOST
        ]
        
        # 添加额外参数
        if extra_args:
            cmd.extend(extra_args)
            
        # 添加包名
        cmd.append(package)
        
        subprocess.check_call(cmd)
        print(f"成功安装：{package}")
        return True
    except Exception as e:
        print(f"安装 {package} 时出错：{e}")
        return False

def install_torch():
    """特殊处理PyTorch的安装"""
    try:
        # 获取系统信息
        python_version = get_python_version()
        is_windows = platform.system() == "Windows"
        
        if is_windows:
            # Windows系统使用CPU版本
            install_package(
                "torch==2.0.1+cpu",
                extra_args=["--extra-index-url", "https://download.pytorch.org/whl/cpu"]
            )
        else:
            # Linux/Mac系统使用默认版本
            install_package("torch==2.0.1")
            
        print("成功安装：PyTorch")
        return True
    except Exception as e:
        print(f"安装PyTorch时出错：{e}")
        print("尝试安装较低版本...")
        try:
            if is_windows:
                install_package(
                    "torch==1.13.1+cpu",
                    extra_args=["--extra-index-url", "https://download.pytorch.org/whl/cpu"]
                )
            else:
                install_package("torch==1.13.1")
            print("成功安装：PyTorch (低版本)")
            return True
        except Exception as e2:
            print(f"安装PyTorch低版本时出错：{e2}")
            return False

def install_transformers():
    """安装transformers及其依赖"""
    try:
        # 安装基础transformers包
        install_package("transformers")
        
        # 安装tokenizers（预编译版本）
        install_package("tokenizers")
        
        # 尝试安装预编译的sentencepiece
        try:
            if platform.system() == "Windows":
                # 修改安装命令格式
                install_package(
                    "sentencepiece",
                    extra_args=["--only-binary", ":all:"]
                )
            else:
                install_package("sentencepiece")
        except Exception as e:
            print(f"警告：sentencepiece安装失败（{e}），但不影响基本功能")
            # 尝试安装较低版本
            try:
                install_package("sentencepiece==0.1.96")
            except Exception as e2:
                print(f"警告：sentencepiece低版本安装也失败（{e2}），跳过此依赖")
        
        return True
    except Exception as e:
        print(f"安装transformers相关包时出错：{e}")
        return False

def install_requirements():
    """安装依赖包"""
    try:
        print(f"\n使用阿里云镜像源: {MIRROR_URL}")
        
        # 更新pip
        subprocess.check_call([
            sys.executable, "-m", "pip", "install", "--upgrade", "pip",
            "-i", MIRROR_URL, "--trusted-host", MIRROR_HOST
        ])
        print("pip 更新成功")

        # 安装基础包
        basic_packages = [
            "wheel",
            "setuptools",
            "certifi",
            "numpy",
            "jieba",
            "tqdm"
        ]
        
        for package in basic_packages:
            install_package(package)
        
        # 特殊处理PyTorch
        install_torch()
        
        # 安装transformers及其依赖
        install_transformers()
        
        print("\n基本依赖安装完成！")
        
        # 设置为默认镜像源
        subprocess.check_call([
            sys.executable, "-m", "pip", "config", "set",
            "global.index-url", MIRROR_URL
        ])
        print("已将阿里云设置为默认镜像源")
            
    except Exception as e:
        print(f"安装过程中出现错误：{e}")

if __name__ == "__main__":
    # 设置环境变量
    os.environ["PYTHONIOENCODING"] = "utf-8"
    
    # 设置控制台编码
    if sys.platform.startswith('win'):
        try:
            locale.setlocale(locale.LC_ALL, 'Chinese_China.UTF8')
        except locale.Error:
            try:
                locale.setlocale(locale.LC_ALL, 'zh_CN.UTF-8')
            except locale.Error:
                print("警告：无法设置中文语言环境")
    
    print("=== Python 依赖包安装工具 ===")
    install_requirements()