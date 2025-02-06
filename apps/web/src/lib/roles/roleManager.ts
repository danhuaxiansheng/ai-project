import { Role, RoleMessage } from '@/types/role';

export class RoleManager {
  private roles: Map<string, Role> = new Map();
  private activeRoles: Set<string> = new Set();
  
  constructor() {
    this.initializeRoles();
  }

  private initializeRoles() {
    const defaultRoles: Role[] = [
      {
        id: 'product_manager',
        name: '产品经理',
        type: 'management',
        priority: 1,
        description: '需求分析和任务分配，把控创作方向',
        avatar: '/avatars/pm.png'
      },
      {
        id: 'world_builder',
        name: '世界观架构师',
        type: 'creation',
        priority: 2,
        description: '构建小说世界观和设定',
        avatar: '/avatars/world.png'
      },
      // ... 其他角色初始化
    ];

    defaultRoles.forEach(role => this.roles.set(role.id, role));
  }

  public activateRole(roleId: string): boolean {
    if (!this.roles.has(roleId)) return false;
    this.activeRoles.add(roleId);
    return true;
  }

  public deactivateRole(roleId: string): boolean {
    return this.activeRoles.delete(roleId);
  }

  public getActiveRoles(): Role[] {
    return Array.from(this.activeRoles)
      .map(id => this.roles.get(id)!)
      .sort((a, b) => a.priority - b.priority);
  }
} 