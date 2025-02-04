import { RoleAdjustment } from "@/types/role";

class ControlAPI {
  private baseUrl = "/api/control";

  async pauseAll() {
    try {
      const response = await fetch(`${this.baseUrl}/pause-all`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to pause system");
      }

      return await response.json();
    } catch (error) {
      console.error("Pause all error:", error);
      throw error;
    }
  }

  async adjustRole(roleId: string, adjustment: RoleAdjustment) {
    try {
      const response = await fetch(`${this.baseUrl}/roles/${roleId}/adjust`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adjustment),
      });

      if (!response.ok) {
        throw new Error("Failed to adjust role");
      }

      return await response.json();
    } catch (error) {
      console.error("Role adjustment error:", error);
      throw error;
    }
  }

  async rollbackTask(taskId: string) {
    try {
      const response = await fetch(`${this.baseUrl}/tasks/${taskId}/rollback`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to rollback task");
      }

      return await response.json();
    } catch (error) {
      console.error("Task rollback error:", error);
      throw error;
    }
  }

  async resumeRole(roleId: string) {
    try {
      const response = await fetch(`${this.baseUrl}/roles/${roleId}/resume`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to resume role");
      }

      return await response.json();
    } catch (error) {
      console.error("Resume role error:", error);
      throw error;
    }
  }

  async pauseRole(roleId: string) {
    try {
      const response = await fetch(`${this.baseUrl}/roles/${roleId}/pause`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to pause role");
      }

      return await response.json();
    } catch (error) {
      console.error("Pause role error:", error);
      throw error;
    }
  }
}

export const controlAPI = new ControlAPI();
