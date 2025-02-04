import { Chapter } from "@/types/chapter";
import { apiClient } from "./client";

export const chapterAPI = {
  async getNovelChapters(novelId: string) {
    const { data } = await apiClient.get<Chapter[]>(
      `/novels/${novelId}/chapters`
    );
    return data;
  },

  async getChapter(novelId: string, chapterNumber: number) {
    const { data } = await apiClient.get<Chapter>(
      `/novels/${novelId}/chapters/${chapterNumber}`
    );
    return data;
  },

  async createChapter(
    novelId: string,
    chapterData: Pick<Chapter, "title" | "content" | "chapterNumber">
  ) {
    const { data } = await apiClient.post<Chapter>(
      `/novels/${novelId}/chapters`,
      chapterData
    );
    return data;
  },

  async updateChapter(
    novelId: string,
    chapterNumber: number,
    chapterData: Partial<Pick<Chapter, "title" | "content">>
  ) {
    const { data } = await apiClient.put<Chapter>(
      `/novels/${novelId}/chapters/${chapterNumber}`,
      chapterData
    );
    return data;
  },

  async deleteChapter(novelId: string, chapterNumber: number) {
    await apiClient.delete(`/novels/${novelId}/chapters/${chapterNumber}`);
  },
};
