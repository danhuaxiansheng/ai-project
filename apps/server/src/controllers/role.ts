import { Request, Response } from "express";
import { RoleService } from "../services/role";
import { NotFoundError } from "../utils/errors";

export class RoleController {
  private service = new RoleService();

  public getAllRoles = async (req: Request, res: Response) => {
    const roles = await this.service.getAllRoles();
    res.json(roles || []);
  };

  public getRoleById = async (req: Request, res: Response) => {
    const role = await this.service.getRoleById(req.params.id);
    if (!role) {
      throw new NotFoundError("角色不存在");
    }
    res.json(role);
  };

  public createRole = async (req: Request, res: Response) => {
    const role = await this.service.createRole(req.body.type);
    res.status(201).json(role);
  };

  public updateRole = async (req: Request, res: Response) => {
    const role = await this.service.updateRole(req.params.id, req.body);
    if (!role) {
      throw new NotFoundError("角色不存在");
    }
    res.json(role);
  };

  public deleteRole = async (req: Request, res: Response) => {
    await this.service.deleteRole(req.params.id);
    res.status(204).send();
  };

  public startRole = async (req: Request, res: Response) => {
    const role = await this.service.startRole(req.params.id);
    if (!role) {
      throw new NotFoundError("角色不存在");
    }
    res.json(role);
  };

  public pauseRole = async (req: Request, res: Response) => {
    const role = await this.service.pauseRole(req.params.id);
    if (!role) {
      throw new NotFoundError("角色不存在");
    }
    res.json(role);
  };
}
