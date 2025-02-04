import { MonitorState, MonitorUpdate } from "@/types/monitor";
import { Role } from "@/types/role";
import { Task } from "@/types/task";
import { Alert } from "@/types/alert";
import { mockRoles, mockTasks, mockAlerts } from "./mockData";

class MonitorService {
  private subscribers: ((update: MonitorUpdate) => void)[] = [];
  private state: MonitorState = {
    roles: mockRoles,
    tasks: mockTasks,
    alerts: mockAlerts,
    systemStatus: "running",
  };

  constructor() {
    this.initWebSocket();
    this.simulateUpdates();
  }

  private initWebSocket() {
    // TODO: 实现真实的WebSocket连接
    console.log("WebSocket connection initialized");
  }

  private simulateUpdates() {
    // 模拟定期更新
    setInterval(() => {
      const randomRole =
        this.state.roles[Math.floor(Math.random() * this.state.roles.length)];
      const update: MonitorUpdate = {
        type: "role",
        data: {
          ...randomRole,
          settings: {
            ...randomRole.settings,
            speed: Math.min(
              100,
              randomRole.settings.speed + Math.random() * 10 - 5
            ),
          },
        },
      };
      this.handleUpdate(update);
    }, 5000);
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

  private updateTasks(taskData: Task | Task[]) {
    if (Array.isArray(taskData)) {
      this.state.tasks = taskData;
    } else {
      const index = this.state.tasks.findIndex((t) => t.id === taskData.id);
      if (index >= 0) {
        this.state.tasks[index] = taskData;
      } else {
        this.state.tasks.push(taskData);
      }
    }
  }

  private updateAlerts(alertData: Alert | Alert[]) {
    if (Array.isArray(alertData)) {
      this.state.alerts = alertData;
    } else {
      this.state.alerts = [alertData, ...this.state.alerts].slice(0, 10);
    }
  }

  private updateSystem(systemStatus: MonitorState["systemStatus"]) {
    this.state.systemStatus = systemStatus;
  }

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
