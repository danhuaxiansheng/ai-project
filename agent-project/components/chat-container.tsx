"use client";

import { useState } from "react";
import { Message } from "@/types/message";
import { cn } from "@/lib/utils";
import { useRoleStore } from "@/store/role-store";
import { useChatStore } from "@/store/chat-store";
import { Send, Loader2 } from "lucide-react";
import { ChatMessage } from "./chat-message";
import { useEffect } from "react";
import { APIService } from "@/services/api";
import { toast } from "sonner";

interface ChatContainerProps {
  className?: string;
}

export function ChatContainer({ className }: ChatContainerProps) {
  const { selectedRole } = useRoleStore();
  const {
    messages,
    addMessage,
    setMessageStatus,
    clearMessages,
    loadMessages,
  } = useChatStore();
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !selectedRole) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: selectedRole,
      timestamp: Date.now(),
      type: "user",
    };
    debugger;
    addMessage(userMessage);
    setInputValue("");
    setIsSending(true);

    try {
      const response = await APIService.chatWithAI(selectedRole, inputValue);

      if (response.status === "success") {
        const assistantMessage: Message = {
          id: Date.now().toString(),
          content: response.content,
          role: selectedRole,
          timestamp: Date.now(),
          type: "assistant",
        };
        addMessage(assistantMessage);
      } else {
        toast.error(response.message || "发送失败");
      }
    } catch (error) {
      toast.error("发送失败");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearMessages = () => {
    if (window.confirm("确定要清除所有消息吗？")) {
      clearMessages();
      toast.success("消息已清除");
    }
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* 聊天头部 */}
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-semibold">
          {selectedRole ? (
            <div className="flex items-center gap-2">
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

      {/* 消息列表 */}
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
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
      </div>

      {/* 输入区域 */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!selectedRole || isSending}
            className={cn(
              "flex-1 px-3 py-2 border rounded-md",
              !selectedRole && "cursor-not-allowed opacity-50"
            )}
            placeholder={selectedRole ? "输入消息..." : "请先选择角色"}
          />
          <button
            onClick={handleSendMessage}
            disabled={!selectedRole || !inputValue.trim() || isSending}
            className={cn(
              "px-4 py-2 bg-primary text-primary-foreground rounded-md",
              "flex items-center gap-2",
              (!selectedRole || !inputValue.trim() || isSending) &&
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
