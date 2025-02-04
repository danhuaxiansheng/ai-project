import fs from "fs/promises";
import path from "path";
import { Novel } from "../models/novel";
import logger from "../utils/logger";
import { Role } from "../models/role";

const DATA_DIR = path.join(process.cwd(), "data");
const NOVELS_DIR = path.join(DATA_DIR, "novels");
const CHAPTERS_DIR = path.join(DATA_DIR, "chapters");
const ROLES_DIR = path.join(DATA_DIR, "roles");

// 确保数据目录存在
export const initStorage = async () => {
  try {
    // 确保所有必要的目录都存在
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.mkdir(NOVELS_DIR, { recursive: true });
    await fs.mkdir(CHAPTERS_DIR, { recursive: true });
    await fs.mkdir(ROLES_DIR, { recursive: true });

    logger.info("数据存储目录已初始化:", {
      dataDir: DATA_DIR,
      novelsDir: NOVELS_DIR,
      chaptersDir: CHAPTERS_DIR,
      rolesDir: ROLES_DIR,
    });
  } catch (error) {
    logger.error("初始化数据存储目录失败:", error);
    throw error;
  }
};

// 生成唯一ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export interface Chapter {
  id: string;
  novelId: string;
  chapterNumber: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export const storageService = {
  async getAllNovels(): Promise<Novel[]> {
    try {
      const files = await fs.readdir(NOVELS_DIR);
      const novels = await Promise.all(
        files.map(async (file) => {
          const content = await fs.readFile(
            path.join(NOVELS_DIR, file),
            "utf-8"
          );
          return JSON.parse(content) as Novel;
        })
      );
      return novels.sort((a, b) => {
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      });
    } catch (error) {
      logger.error("读取小说列表失败:", error);
      return [];
    }
  },

  async getNovelById(id: string): Promise<Novel | null> {
    try {
      const content = await fs.readFile(
        path.join(NOVELS_DIR, `${id}.json`),
        "utf-8"
      );
      return JSON.parse(content) as Novel;
    } catch (error) {
      return null;
    }
  },

  async createNovel(data: Omit<Novel, "id">): Promise<Novel> {
    const id = generateId();
    const novel: Novel = {
      id,
      ...data,
      status: "draft",
      progress: 0,
      currentChapter: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await fs.writeFile(
      path.join(NOVELS_DIR, `${id}.json`),
      JSON.stringify(novel, null, 2)
    );
    return novel;
  },

  async updateNovel(id: string, data: Partial<Novel>): Promise<Novel | null> {
    const novel = await this.getNovelById(id);
    if (!novel) return null;

    const updatedNovel = {
      ...novel,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    await fs.writeFile(
      path.join(NOVELS_DIR, `${id}.json`),
      JSON.stringify(updatedNovel, null, 2)
    );
    return updatedNovel;
  },

  async deleteNovel(id: string): Promise<void> {
    try {
      await fs.unlink(path.join(NOVELS_DIR, `${id}.json`));
    } catch (error) {
      logger.error(`删除小说 ${id} 失败:`, error);
    }
  },

  async getNovelChapters(novelId: string): Promise<Chapter[]> {
    try {
      const novelDir = path.join(CHAPTERS_DIR, novelId);
      await fs.mkdir(novelDir, { recursive: true });
      const files = await fs.readdir(novelDir);
      const chapters = await Promise.all(
        files.map(async (file) => {
          const content = await fs.readFile(path.join(novelDir, file), "utf-8");
          return JSON.parse(content) as Chapter;
        })
      );
      return chapters.sort((a, b) => a.chapterNumber - b.chapterNumber);
    } catch (error) {
      logger.error(`获取小说 ${novelId} 章节列表失败:`, error);
      return [];
    }
  },

  async getChapter(
    novelId: string,
    chapterNumber: number
  ): Promise<Chapter | null> {
    try {
      const content = await fs.readFile(
        path.join(CHAPTERS_DIR, novelId, `${chapterNumber}.json`),
        "utf-8"
      );
      return JSON.parse(content) as Chapter;
    } catch (error) {
      return null;
    }
  },

  async createChapter(
    novelId: string,
    data: Pick<Chapter, "title" | "content" | "chapterNumber">
  ): Promise<Chapter> {
    const id = generateId();
    const chapter: Chapter = {
      id,
      novelId,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const novelDir = path.join(CHAPTERS_DIR, novelId);
    await fs.mkdir(novelDir, { recursive: true });
    await fs.writeFile(
      path.join(novelDir, `${data.chapterNumber}.json`),
      JSON.stringify(chapter, null, 2)
    );

    // 更新小说进度
    const novel = await this.getNovelById(novelId);
    if (novel) {
      const progress = Math.round(
        (data.chapterNumber / novel.totalChapters) * 100
      );
      await this.updateNovel(novelId, {
        currentChapter: data.chapterNumber,
        progress,
      });
    }

    return chapter;
  },

  async updateChapter(
    novelId: string,
    chapterNumber: number,
    data: Partial<Chapter>
  ): Promise<Chapter | null> {
    const chapter = await this.getChapter(novelId, chapterNumber);
    if (!chapter) return null;

    const updatedChapter = {
      ...chapter,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    await fs.writeFile(
      path.join(CHAPTERS_DIR, novelId, `${chapterNumber}.json`),
      JSON.stringify(updatedChapter, null, 2)
    );
    return updatedChapter;
  },

  async deleteChapter(novelId: string, chapterNumber: number): Promise<void> {
    try {
      await fs.unlink(
        path.join(CHAPTERS_DIR, novelId, `${chapterNumber}.json`)
      );
    } catch (error) {
      logger.error(`删除小说 ${novelId} 第 ${chapterNumber} 章失败:`, error);
    }
  },

  async getAllRoles(): Promise<Role[]> {
    try {
      const files = await fs.readdir(ROLES_DIR);
      const roles = await Promise.all(
        files.map(async (file) => {
          const content = await fs.readFile(
            path.join(ROLES_DIR, file),
            "utf-8"
          );
          return JSON.parse(content) as Role;
        })
      );
      return roles.sort((a, b) => {
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      });
    } catch (error) {
      logger.error("读取角色列表失败:", error);
      return [];
    }
  },

  async getRoleById(id: string): Promise<Role | null> {
    try {
      const content = await fs.readFile(
        path.join(ROLES_DIR, `${id}.json`),
        "utf-8"
      );
      return JSON.parse(content) as Role;
    } catch (error) {
      return null;
    }
  },

  async createRole(data: Omit<Role, "id">): Promise<Role> {
    const id = generateId();
    const role: Role = {
      id,
      ...data,
      status: "idle",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await fs.writeFile(
      path.join(ROLES_DIR, `${id}.json`),
      JSON.stringify(role, null, 2)
    );
    return role;
  },

  async updateRole(id: string, data: Partial<Role>): Promise<Role | null> {
    const role = await this.getRoleById(id);
    if (!role) return null;

    const updatedRole = {
      ...role,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    await fs.writeFile(
      path.join(ROLES_DIR, `${id}.json`),
      JSON.stringify(updatedRole, null, 2)
    );
    return updatedRole;
  },

  async deleteRole(id: string): Promise<void> {
    try {
      await fs.unlink(path.join(ROLES_DIR, `${id}.json`));
    } catch (error) {
      logger.error(`删除角色 ${id} 失败:`, error);
    }
  },
};
