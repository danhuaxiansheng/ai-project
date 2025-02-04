import { Role, RoleModel } from "../models/Role";
import { loadRoleConfig } from "../config/role";

export class RoleService {
  public async getAllRoles(): Promise<Role[]> {
    return RoleModel.find().sort({ updatedAt: -1 });
  }

  public async getRoleById(id: string): Promise<Role | null> {
    return RoleModel.findById(id);
  }

  public async createRole(type: Role["type"]): Promise<Role> {
    const config = loadRoleConfig(type);
    const role = new RoleModel({
      ...config,
      status: "idle",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return role.save();
  }

  public async updateRole(
    id: string,
    data: Partial<Role>
  ): Promise<Role | null> {
    return RoleModel.findByIdAndUpdate(
      id,
      {
        ...data,
        updatedAt: new Date(),
      },
      { new: true }
    );
  }

  public async deleteRole(id: string): Promise<void> {
    await RoleModel.findByIdAndDelete(id);
  }

  public async startRole(id: string): Promise<Role | null> {
    return RoleModel.findByIdAndUpdate(
      id,
      {
        status: "working",
        updatedAt: new Date(),
      },
      { new: true }
    );
  }

  public async pauseRole(id: string): Promise<Role | null> {
    return RoleModel.findByIdAndUpdate(
      id,
      {
        status: "paused",
        updatedAt: new Date(),
      },
      { new: true }
    );
  }
}
