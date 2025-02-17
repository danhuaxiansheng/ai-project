import { storyDB } from "./db";

class SyncManager {
  private syncInterval: number = 5 * 60 * 1000; // 5分钟
  private intervalId: NodeJS.Timeout | null = null;
  private isOnline: boolean = true;
  private pendingSync: boolean = false;

  constructor() {
    if (typeof window !== "undefined") {
      // 监听在线状态
      window.addEventListener("online", this.handleOnline);
      window.addEventListener("offline", this.handleOffline);
      // 监听页面关闭
      window.addEventListener("beforeunload", this.handleBeforeUnload);
      // 初始化在线状态
      this.isOnline = navigator.onLine;
    }
  }

  start() {
    if (this.intervalId) return;
    this.intervalId = setInterval(this.sync, this.syncInterval);
    // 立即执行一次同步
    this.sync();
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private handleOnline = async () => {
    this.isOnline = true;
    if (this.pendingSync) {
      await this.sync();
    }
  };

  private handleOffline = () => {
    this.isOnline = false;
    this.pendingSync = true;
  };

  private handleBeforeUnload = async (event: BeforeUnloadEvent) => {
    if (this.pendingSync) {
      event.preventDefault();
      event.returnValue = "有未保存的更改，确定要离开吗？";
      try {
        await this.sync();
      } catch (error) {
        console.error("Error syncing before unload:", error);
      }
    }
  };

  private sync = async () => {
    if (!this.isOnline) {
      this.pendingSync = true;
      return;
    }

    try {
      await storyDB.syncCache();
      this.pendingSync = false;
    } catch (error) {
      console.error("Sync failed:", error);
      this.pendingSync = true;
    }
  };

  // 手动触发同步
  async forceSyncNow() {
    return this.sync();
  }

  // 检查是否有未同步的更改
  hasPendingChanges() {
    return this.pendingSync;
  }

  // 清理事件监听器
  destroy() {
    this.stop();
    if (typeof window !== "undefined") {
      window.removeEventListener("online", this.handleOnline);
      window.removeEventListener("offline", this.handleOffline);
      window.removeEventListener("beforeunload", this.handleBeforeUnload);
    }
  }
}

export const syncManager = new SyncManager();
