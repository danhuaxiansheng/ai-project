import { Role } from "../models/role";
import { storageService } from "./storage";
import { loadRoleConfig } from "../config/role";

export class RoleService {
  public async getAllRoles(): Promise<Role[]> {
    return storageService.getAllRoles();
  }

  public async getRoleById(id: string): Promise<Role | null> {
    return storageService.getRoleById(id);
  }

  public async createRole(type: Role["type"]): Promise<Role> {
    const config = loadRoleConfig(type);
    return storageService.createRole(config);
  }

  public async updateRole(
    id: string,
    data: Partial<Role>
  ): Promise<Role | null> {
    return storageService.updateRole(id, data);
  }

  public async deleteRole(id: string): Promise<void> {
    return storageService.deleteRole(id);
  }

  public async startRole(id: string): Promise<Role | null> {
    return storageService.updateRole(id, { status: "working" });
  }

  public async pauseRole(id: string): Promise<Role | null> {
    return storageService.updateRole(id, { status: "paused" });
  }
}
