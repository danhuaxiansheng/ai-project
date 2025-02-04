import { apiClient } from "./client";

export interface TaskResult {
  result: string;
}

export const taskAPI = {
  async executeTask(roleId: string, novelId: string, task: string) {
    const { data } = await apiClient.post<TaskResult>(
      `/roles/${roleId}/novels/${novelId}/execute`,
      { task }
    );
    return data;
  },
};
