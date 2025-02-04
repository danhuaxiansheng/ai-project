import { Novel } from "../models/novel";
import { storageService } from "./storage";

export class NovelService {
  public async getAllNovels(): Promise<Novel[]> {
    return storageService.getAllNovels();
  }

  public async getNovelById(id: string): Promise<Novel | null> {
    return storageService.getNovelById(id);
  }

  public async createNovel(data: Partial<Novel>): Promise<Novel> {
    const novelData = {
      title: data.title || "",
      description: data.description || "",
      totalChapters: data.totalChapters || 1,
      settings: data.settings || {
        genre: [],
        theme: [],
        targetLength: 50000,
        style: [],
        constraints: [],
      },
    };
    return storageService.createNovel(novelData as Omit<Novel, "id">);
  }

  public async updateNovel(
    id: string,
    data: Partial<Novel>
  ): Promise<Novel | null> {
    return storageService.updateNovel(id, data);
  }

  public async deleteNovel(id: string): Promise<void> {
    return storageService.deleteNovel(id);
  }

  public async startNovel(id: string): Promise<Novel | null> {
    return storageService.updateNovel(id, { status: "creating" });
  }

  public async pauseNovel(id: string): Promise<Novel | null> {
    return storageService.updateNovel(id, { status: "paused" });
  }
}
