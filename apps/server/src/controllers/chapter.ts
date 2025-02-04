import { Request, Response } from "express";
import { storageService } from "../services/storage";
import { NotFoundError } from "../utils/errors";

export class ChapterController {
  public getNovelChapters = async (req: Request, res: Response) => {
    const { novelId } = req.params;
    const novel = await storageService.getNovelById(novelId);
    if (!novel) {
      throw new NotFoundError("小说不存在");
    }

    const chapters = await storageService.getNovelChapters(novelId);
    res.json(chapters);
  };

  public getChapter = async (req: Request, res: Response) => {
    const { novelId, chapterNumber } = req.params;
    const chapter = await storageService.getChapter(
      novelId,
      parseInt(chapterNumber)
    );
    if (!chapter) {
      throw new NotFoundError("章节不存在");
    }
    res.json(chapter);
  };

  public createChapter = async (req: Request, res: Response) => {
    const { novelId } = req.params;
    const novel = await storageService.getNovelById(novelId);
    if (!novel) {
      throw new NotFoundError("小说不存在");
    }

    const chapter = await storageService.createChapter(novelId, req.body);
    res.status(201).json(chapter);
  };

  public updateChapter = async (req: Request, res: Response) => {
    const { novelId, chapterNumber } = req.params;
    const chapter = await storageService.updateChapter(
      novelId,
      parseInt(chapterNumber),
      req.body
    );
    if (!chapter) {
      throw new NotFoundError("章节不存在");
    }
    res.json(chapter);
  };

  public deleteChapter = async (req: Request, res: Response) => {
    const { novelId, chapterNumber } = req.params;
    await storageService.deleteChapter(novelId, parseInt(chapterNumber));
    res.status(204).send();
  };
}
