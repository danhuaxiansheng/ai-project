import { Request, Response } from "express";
import { RoleService } from "../services/role";

export class RoleController {
  private service = new RoleService();

  public getAllRoles = async (req: Request, res: Response) => {
    try {
      const roles = await this.service.getAllRoles();
      res.json(roles);
    } catch (error) {
      res.status(500).json({ error: "获取角色列表失败" });
    }
  };

  public getRoleById = async (req: Request, res: Response) => {
    try {
      const role = await this.service.getRoleById(req.params.id);
      if (!role) {
        return res.status(404).json({ error: "角色不存在" });
      }
      res.json(role);
    } catch (error) {
      res.status(500).json({ error: "获取角色详情失败" });
    }
  };

  public createRole = async (req: Request, res: Response) => {
    try {
      const role = await this.service.createRole(req.body);
      res.status(201).json(role);
    } catch (error) {
      res.status(500).json({ error: "创建角色失败" });
    }
  };

  public updateRole = async (req: Request, res: Response) => {
    try {
      const role = await this.service.updateRole(req.params.id, req.body);
      if (!role) {
        return res.status(404).json({ error: "角色不存在" });
      }
      res.json(role);
    } catch (error) {
      res.status(500).json({ error: "更新角色失败" });
    }
  };

  public deleteRole = async (req: Request, res: Response) => {
    try {
      await this.service.deleteRole(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "删除角色失败" });
    }
  };

  public startRole = async (req: Request, res: Response) => {
    try {
      const role = await this.service.startRole(req.params.id);
      if (!role) {
        return res.status(404).json({ error: "角色不存在" });
      }
      res.json(role);
    } catch (error) {
      res.status(500).json({ error: "启动角色失败" });
    }
  };

  public pauseRole = async (req: Request, res: Response) => {
    try {
      const role = await this.service.pauseRole(req.params.id);
      if (!role) {
        return res.status(404).json({ error: "角色不存在" });
      }
      res.json(role);
    } catch (error) {
      res.status(500).json({ error: "暂停角色失败" });
    }
  };
}
