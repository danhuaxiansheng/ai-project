"use client";

import { cn } from "@/lib/utils";
import { useRoleStore } from "@/store/role-store";
import { useChatStore } from "@/store/chat-store";
import { Send, Loader2 } from "lucide-react";
import { ChatMessage } from "./chat-message";
import { useState, useEffect } from "react";
import { APIService } from "@/services/api";
import { toast } from "sonner";

interface ChatContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ChatContainer({ className, ...props }: ChatContainerProps) {
  const { selectedRole } = useRoleStore();
  const {
    messages,
    addMessage,
    setMessageStatus,
    clearMessages,
    loadMessages,
  } = useChatStore();
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleSend = async () => {
    if (!selectedRole || !input.trim() || isSending) return;

    setIsSending(true);
    const messageId = addMessage({
      role: selectedRole,
      content: input.trim(),
    });

    setInput("");

    try {
      const response = await APIService.chatWithAI(selectedRole, input.trim());

      if (response.status === "success") {
        setMessageStatus(messageId, "sent");
        // 添加 AI 的回复
        addMessage({
          role: selectedRole,
          content: response.content,
        });
      } else {
        setMessageStatus(messageId, "error");
        toast.error(response.message || "发送失败");
      }
    } catch (error) {
      setMessageStatus(messageId, "error");
      toast.error("发送失败");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearMessages = () => {
    if (window.confirm("确定要清除所有消息吗？")) {
      clearMessages();
      toast.success("消息已清除");
    }
  };

  return (
    <div className={cn("flex flex-col", className)} {...props}>
      {/* 聊天头部 */}
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-semibold">
          {selectedRole ? (
            <div className="flex items-center gap-2">
              <selectedRole.icon className="w-4 h-4" />
              {selectedRole.name} - 对话
            </div>
          ) : (
            "请先选择角色"
          )}
        </h2>
        {messages.length > 0 && (
          <button
            onClick={handleClearMessages}
            className="text-sm text-destructive hover:underline"
          >
            清除消息
          </button>
        )}
      </div>

      {/* 消息列表区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!selectedRole ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            选择一个角色开始对话
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            开始和{selectedRole.name}对话
          </div>
        ) : (
          messages.map((message, index) => (
            <ChatMessage
              key={message.id}
              message={message}
              isLast={index === messages.length - 1}
            />
          ))
        )}
      </div>

      {/* 输入区域 */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!selectedRole || isSending}
            className={cn(
              "flex-1 rounded-md border p-2",
              !selectedRole && "cursor-not-allowed opacity-50"
            )}
            placeholder={selectedRole ? "输入消息..." : "请先选择角色"}
          />
          <button
            onClick={handleSend}
            disabled={!selectedRole || !input.trim() || isSending}
            className={cn(
              "px-4 py-2 bg-primary text-primary-foreground rounded-md",
              "flex items-center gap-2",
              (!selectedRole || !input.trim() || isSending) &&
                "opacity-50 cursor-not-allowed"
            )}
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            发送
          </button>
        </div>
      </div>
    </div>
  );
}
