# 虚拟世界生成器

这是一个基于 Python 的虚拟世界生成器，可以根据用户输入生成完整的虚拟世界设定，包括世界起源、地理环境和文明发展等内容。

## 安装说明

1. 克隆项目到本地：

```bash
git clone [项目地址]
cd virtual-world-generator
```

2. 创建并激活虚拟环境（推荐）：

```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# 或
venv\Scripts\activate  # Windows
```

3. 安装依赖（选择以下任一方法）：

方法 1 - 使用安装脚本：

```bash
python install_dependencies.py
```

方法 2 - 手动安装：

```bash
# Windows系统
pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org -r requirements.txt

# Linux/Mac系统
pip install -r requirements.txt
```

如果安装过程中遇到 SSL 证书问题，请先运行：

```bash
python -m pip install --upgrade pip
pip install certifi
```

## 使用方法

1. 进入项目目录：

```bash
cd apps/generator
```

2. 运行示例程序：

```bash
python example_usage.py
```

2. 根据提示输入您想要创造的世界的关键元素。

3. 程序会自动生成世界设定并保存到 `virtual_world.txt` 文件中。

## 功能特点

- 自动提取关键词和主题
- 生成世界起源故事
- 创建地理环境描述
- 生成文明发展历程
- 包含丰富的文化元素

## 注意事项

- 首次运行时会自动下载所需的预训练模型
- 生成结果具有随机性，每次运行可能得到不同的结果
- 建议使用详细的描述作为输入，以获得更好的生成效果

## 目录结构

```
virtual-world-generator/
├── apps/
│   └── generator/
│       ├── __init__.py
│       ├── virtual_world_generator.py
│       └── example_usage.py
├── requirements.txt
└── README.md
```

## 许可证

[添加许可证信息]

## 贡献指南

[添加贡献指南]

```

这样的文档结构可以帮助：

1. 新用户快速安装和使用程序
2. 明确列出所有依赖包及其版本要求
3. 提供清晰的项目结构说明
4. 说明基本的使用方法和注意事项

您觉得这样的文档结构如何？需要添加或修改什么内容吗？
```
