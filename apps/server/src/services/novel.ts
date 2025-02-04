import { Novel, NovelModel } from "../models/novel";

export class NovelService {
  public async getAllNovels(): Promise<Novel[]> {
    try {
      const novels = await NovelModel.find().sort({ updatedAt: -1 });
      return novels || [];
    } catch (error) {
      console.error("获取小说列表失败:", error);
      return [];
    }
  }

  public async getNovelById(id: string): Promise<Novel | null> {
    return NovelModel.findById(id);
  }

  public async createNovel(data: Partial<Novel>): Promise<Novel> {
    const novel = new NovelModel({
      ...data,
      status: "draft",
      progress: 0,
      currentChapter: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return novel.save();
  }

  public async updateNovel(
    id: string,
    data: Partial<Novel>
  ): Promise<Novel | null> {
    return NovelModel.findByIdAndUpdate(
      id,
      {
        ...data,
        updatedAt: new Date(),
      },
      { new: true }
    );
  }

  public async deleteNovel(id: string): Promise<void> {
    await NovelModel.findByIdAndDelete(id);
  }

  public async startNovel(id: string): Promise<Novel | null> {
    return NovelModel.findByIdAndUpdate(
      id,
      {
        status: "creating",
        updatedAt: new Date(),
      },
      { new: true }
    );
  }

  public async pauseNovel(id: string): Promise<Novel | null> {
    return NovelModel.findByIdAndUpdate(
      id,
      {
        status: "paused",
        updatedAt: new Date(),
      },
      { new: true }
    );
  }
}
