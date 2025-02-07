import { useEffect, useRef } from "react";
import { SocketService } from "@/services/socket";
import { useCollaborationStore } from "@/store/collaboration-store";
import { toast } from "sonner";

export function useSocket(roleId?: string) {
  const { addCollaborator, removeCollaborator, updateCollaboratorStatus } =
    useCollaborationStore();
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 3;

  useEffect(() => {
    const socket = SocketService.connect();

    // 连接事件处理
    socket.on("connect", () => {
      console.log("WebSocket 连接成功");
      reconnectAttempts.current = 0;
      if (roleId) {
        SocketService.joinRoom(roleId);
      }
    });

    socket.on("disconnect", () => {
      console.log("WebSocket 连接断开");
      if (reconnectAttempts.current < maxReconnectAttempts) {
        reconnectAttempts.current += 1;
        setTimeout(() => {
          SocketService.connect();
        }, 1000 * Math.pow(2, reconnectAttempts.current));
      } else {
        toast.error("连接失败，请刷新页面重试");
      }
    });

    // 协作状态处理
    socket.on("collaboration", (data) => {
      switch (data.status) {
        case "joined":
          addCollaborator(data.roleId, data.status);
          break;
        case "left":
          removeCollaborator(data.roleId);
          break;
        case "typing":
          updateCollaboratorStatus(data.roleId, data.status);
          break;
      }
    });

    return () => {
      if (roleId) {
        SocketService.leaveRoom(roleId);
      }
      socket.disconnect();
    };
  }, [roleId, addCollaborator, removeCollaborator, updateCollaboratorStatus]);
}
