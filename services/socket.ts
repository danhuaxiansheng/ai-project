import { io, Socket } from "socket.io-client";
import { Role } from "@/types/role";

interface EditEvent {
  role: Role;
  content: string;
  timestamp: number;
}

interface CollaborationEvent {
  roleId: string;
  status: "joined" | "left" | "typing";
}

export class SocketService {
  private static socket: Socket;
  private static baseUrl =
    process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001";
  private static heartbeatInterval: NodeJS.Timeout;

  static connect() {
    if (!this.socket) {
      this.socket = io(this.baseUrl, {
        reconnection: true,
        reconnectionAttempts: 3,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 10000,
      });
      this.setupListeners();
      this.startHeartbeat();
    }
    return this.socket;
  }

  private static setupListeners() {
    this.socket.on("connect", () => {
      console.log("WebSocket 连接成功");
    });

    this.socket.on("disconnect", () => {
      console.log("WebSocket 连接断开");
      this.stopHeartbeat();
    });

    this.socket.on("error", (error) => {
      console.error("WebSocket 错误:", error);
    });

    this.socket.on("pong", () => {
      console.log("收到服务器心跳响应");
    });
  }

  private static startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.socket?.connected) {
        this.socket.emit("ping");
      }
    }, 30000); // 30秒发送一次心跳
  }

  private static stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
  }

  static joinRoom(roleId: string) {
    if (this.socket?.connected) {
      this.socket.emit("join", { roleId });
    }
  }

  static leaveRoom(roleId: string) {
    if (this.socket?.connected) {
      this.socket.emit("leave", { roleId });
    }
  }

  static sendEdit(data: EditEvent) {
    if (this.socket?.connected) {
      this.socket.emit("edit", data);
    }
  }

  static onEdit(callback: (data: EditEvent) => void) {
    this.socket?.on("edit", callback);
    return () => {
      this.socket?.off("edit", callback);
    };
  }

  static sendCollaboration(data: CollaborationEvent) {
    if (this.socket?.connected) {
      this.socket.emit("collaboration", data);
    }
  }

  static onCollaboration(callback: (data: CollaborationEvent) => void) {
    this.socket?.on("collaboration", callback);
    return () => {
      this.socket?.off("collaboration", callback);
    };
  }

  static disconnect() {
    if (this.socket) {
      this.stopHeartbeat();
      this.socket.disconnect();
      this.socket = undefined;
    }
  }
}
