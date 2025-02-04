import { Request, Response } from "express";
import { storageService } from "../services/storage";
import { agentService } from "../services/ai/agent";
import { NotFoundError } from "../utils/errors";

export class TaskController {
  public executeTask = async (req: Request, res: Response) => {
    const { roleId, novelId } = req.params;
    const { task } = req.body;

    const role = await storageService.getRoleById(roleId);
    if (!role) {
      throw new NotFoundError("角色不存在");
    }

    const novel = await storageService.getNovelById(novelId);
    if (!novel) {
      throw new NotFoundError("小说不存在");
    }

    // 获取上下文章节
    const chapters = await storageService.getNovelChapters(novelId);

    // 执行任务
    const result = await agentService.executeTask(role, novel, task, {
      chapters,
    });

    res.json({ result });
  };
}
