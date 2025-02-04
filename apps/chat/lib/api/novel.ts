import { Novel } from "@/types/novel";
import { apiClient } from "./client";

export const novelAPI = {
  async getAllNovels() {
    const { data } = await apiClient.get<Novel[]>("/novels");
    return data;
  },

  async getNovelById(id: string) {
    const { data } = await apiClient.get<Novel>(`/novels/${id}`);
    return data;
  },

  async createNovel(novelData: Omit<Novel, "id" | "status" | "progress">) {
    const { data } = await apiClient.post<Novel>("/novels", novelData);
    return data;
  },

  async updateNovel(id: string, novelData: Partial<Novel>) {
    const { data } = await apiClient.put<Novel>(`/novels/${id}`, novelData);
    return data;
  },

  async deleteNovel(id: string) {
    await apiClient.delete(`/novels/${id}`);
  },

  async startNovel(id: string) {
    const { data } = await apiClient.post<Novel>(`/novels/${id}/start`);
    return data;
  },

  async pauseNovel(id: string) {
    const { data } = await apiClient.post<Novel>(`/novels/${id}/pause`);
    return data;
  },
};
