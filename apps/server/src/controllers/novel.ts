import { Request, Response } from "express";
import { NovelService } from "../services/novel";
import { NotFoundError } from "../utils/errors";

export class NovelController {
  private service = new NovelService();

  public getAllNovels = async (req: Request, res: Response) => {
    const novels = await this.service.getAllNovels();
    res.json(novels || []);
  };

  public getNovelById = async (req: Request, res: Response) => {
    const novel = await this.service.getNovelById(req.params.id);
    if (!novel) {
      throw new NotFoundError("小说不存在");
    }
    res.json(novel);
  };

  public createNovel = async (req: Request, res: Response) => {
    try {
      const novel = await this.service.createNovel(req.body);
      res.status(201).json(novel);
    } catch (error) {
      res.status(500).json({ error: "创建小说失败" });
    }
  };

  public updateNovel = async (req: Request, res: Response) => {
    try {
      const novel = await this.service.updateNovel(req.params.id, req.body);
      if (!novel) {
        return res.status(404).json({ error: "小说不存在" });
      }
      res.json(novel);
    } catch (error) {
      res.status(500).json({ error: "更新小说失败" });
    }
  };

  public deleteNovel = async (req: Request, res: Response) => {
    try {
      await this.service.deleteNovel(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "删除小说失败" });
    }
  };

  public startNovel = async (req: Request, res: Response) => {
    try {
      const novel = await this.service.startNovel(req.params.id);
      if (!novel) {
        return res.status(404).json({ error: "小说不存在" });
      }
      res.json(novel);
    } catch (error) {
      res.status(500).json({ error: "开始创作失败" });
    }
  };

  public pauseNovel = async (req: Request, res: Response) => {
    try {
      const novel = await this.service.pauseNovel(req.params.id);
      if (!novel) {
        return res.status(404).json({ error: "小说不存在" });
      }
      res.json(novel);
    } catch (error) {
      res.status(500).json({ error: "暂停创作失败" });
    }
  };
}
