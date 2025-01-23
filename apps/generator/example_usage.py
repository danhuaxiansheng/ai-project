from virtual_world_generator import WorldGenerator

def main():
    # 创建世界生成器实例
    generator = WorldGenerator()
    
    # 获取用户输入
    user_input = input("请描述您想要创造的世界的关键元素：")
    
    # 处理输入并生成世界
    parsed_data = generator.process_input(user_input)
    world_structure = generator.generate_world_structure(parsed_data)
    
    # 生成小说化描述
    description = generator.generate_novel_description(world_structure)
    
    # 保存结果
    generator.save_output(description)
    
if __name__ == "__main__":
    main() 