import { RoleAdjustment } from "@/types/role";
import { toast } from "@/components/ui/use-toast";

class ControlService {
  async pauseAll() {
    try {
      const response = await fetch("/api/control/pause-all", {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to pause system");

      return await response.json();
    } catch (error) {
      console.error("Pause all error:", error);
      throw error;
    }
  }

  async adjustRole(roleId: string, adjustment: RoleAdjustment) {
    try {
      const response = await fetch(`/api/control/roles/${roleId}/adjust`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adjustment),
      });

      if (!response.ok) throw new Error("Failed to adjust role");

      return await response.json();
    } catch (error) {
      console.error("Role adjustment error:", error);
      throw error;
    }
  }

  async rollbackTask(taskId: string) {
    try {
      const response = await fetch(`/api/control/tasks/${taskId}/rollback`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to rollback task");

      return await response.json();
    } catch (error) {
      console.error("Task rollback error:", error);
      throw error;
    }
  }
}

export const controlService = new ControlService();
