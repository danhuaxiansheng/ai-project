import { MonitorState, MonitorUpdate } from "@/types/monitor";
import { Role } from "@/types/role";
import { Task } from "@/types/task";
import { Alert } from "@/types/alert";

class MonitorService {
  private subscribers: ((update: MonitorUpdate) => void)[] = [];
  private state: MonitorState = {
    roles: [],
    tasks: [],
    alerts: [],
    systemStatus: "running",
  };

  constructor() {
    this.initWebSocket();
  }

  private initWebSocket() {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!);

    ws.onmessage = (event) => {
      const update: MonitorUpdate = JSON.parse(event.data);
      this.handleUpdate(update);
    };
  }

  private handleUpdate(update: MonitorUpdate) {
    switch (update.type) {
      case "role":
        this.updateRoles(update.data);
        break;
      case "task":
        this.updateTasks(update.data);
        break;
      case "alert":
        this.updateAlerts(update.data);
        break;
      case "system":
        this.updateSystem(update.data);
        break;
    }

    this.notifySubscribers(update);
  }

  private updateRoles(roleData: Role | Role[]) {
    if (Array.isArray(roleData)) {
      this.state.roles = roleData;
    } else {
      const index = this.state.roles.findIndex((r) => r.id === roleData.id);
      if (index >= 0) {
        this.state.roles[index] = roleData;
      } else {
        this.state.roles.push(roleData);
      }
    }
  }

  // ... 类似的 updateTasks 和 updateAlerts 方法

  subscribe(callback: (update: MonitorUpdate) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((cb) => cb !== callback);
    };
  }

  private notifySubscribers(update: MonitorUpdate) {
    this.subscribers.forEach((callback) => callback(update));
  }

  getState(): MonitorState {
    return { ...this.state };
  }
}

export const monitorService = new MonitorService();
