import type { Role } from '../../types/chat'

export const roles: Role[] = [
  {
    id: 'product-manager',
    name: '产品经理',
    description: '负责整体产品规划与定义',
    type: 'management'
  },
  {
    id: 'novel-manager',
    name: '小说产品经理',
    description: '专注网文市场分析',
    type: 'management'
  },
  {
    id: 'setting-creator',
    name: '设定创作者',
    description: '构建完整世界观体系',
    type: 'creation'
  },
  {
    id: 'story-creator',
    name: '小说创作者',
    description: '进行核心故事创作',
    type: 'creation'
  },
  {
    id: 'writer',
    name: '创作助手',
    description: '协助具体写作工作',
    type: 'creation'
  },
  {
    id: 'rater',
    name: '评分员',
    description: '评估作品质量',
    type: 'quality'
  },
  {
    id: 'reviewer',
    name: '审核员',
    description: '把控作品整体质量',
    type: 'quality'
  }
] 