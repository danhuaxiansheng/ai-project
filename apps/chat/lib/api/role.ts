import { Role } from "@/types/role";
import { apiClient } from "./client";

export const roleAPI = {
  async getAllRoles() {
    const { data } = await apiClient.get<Role[]>("/roles");
    return data;
  },

  async getRoleById(id: string) {
    const { data } = await apiClient.get<Role>(`/roles/${id}`);
    return data;
  },

  async createRole(type: Role["type"]) {
    const { data } = await apiClient.post<Role>("/roles", { type });
    return data;
  },

  async updateRole(id: string, roleData: Partial<Role>) {
    const { data } = await apiClient.put<Role>(`/roles/${id}`, roleData);
    return data;
  },

  async deleteRole(id: string) {
    await apiClient.delete(`/roles/${id}`);
  },

  async startRole(id: string) {
    const { data } = await apiClient.post<Role>(`/roles/${id}/start`);
    return data;
  },

  async pauseRole(id: string) {
    const { data } = await apiClient.post<Role>(`/roles/${id}/pause`);
    return data;
  },
};
