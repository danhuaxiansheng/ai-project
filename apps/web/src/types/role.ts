// 角色类型定义
export type RoleType = 'management' | 'creation' | 'quality';

export interface Role {
  id: string;
  name: string;
  type: RoleType;
  priority: number;
  description: string;
  avatar: string;
}

export interface RoleMessage {
  id: string;
  roleId: string;
  content: string;
  timestamp: number;
  type: 'text' | 'suggestion' | 'review' | 'decision';
  replyTo?: string;
} 