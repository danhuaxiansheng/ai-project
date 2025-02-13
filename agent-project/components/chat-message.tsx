"use client";

import { cn } from "@/lib/utils";
import { Message } from "@/types/message";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { DynamicIcon } from "./dynamic-icon";
import { MessageActions } from "./message-actions";
import { useState } from "react";
import { useChatStore } from "@/store/chat-store";
import { toast } from "sonner";

interface ChatMessageProps {
  message: Message;
  isLast?: boolean;
  onRegenerate?: () => Promise<void>;
}

export function ChatMessage({
  message,
  isLast,
  onRegenerate,
}: ChatMessageProps) {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const { role, content, timestamp, status, type } = message;

  const handleRegenerate = async () => {
    if (!onRegenerate) return;
    setIsRegenerating(true);
    try {
      await onRegenerate();
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast.success("已复制到剪贴板");
  };

  const handleFeedback = (type: "positive" | "negative") => {
    // TODO: 实现反馈功能
    toast.success(`感谢您的${type === "positive" ? "肯定" : "反馈"}`);
  };

  const handleFollowUp = () => {
    // TODO: 实现追问功能
    toast.info("追问功能开发中");
  };

  return (
    <div className="flex gap-3 group">
      {/* 角色图标 */}
      <div
        className={cn(
          "w-8 h-8 rounded-md flex items-center justify-center",
          "bg-muted relative overflow-hidden"
        )}
      >
        <DynamicIcon
          name={role.icon}
          width="16"
          height="16"
          className={cn(
            "text-foreground",
            status === "pending" && "opacity-50"
          )}
        />
      </div>

      {/* 消息内容 */}
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{role.name}</span>
          <span className="text-xs text-muted-foreground">
            {format(timestamp, "HH:mm:ss")}
            {message.version &&
              message.version > 1 &&
              ` (版本 ${message.version})`}
          </span>
        </div>
        <div className="text-sm whitespace-pre-wrap">{content}</div>

        {/* 消息操作按钮 */}
        {type === "assistant" && (
          <MessageActions
            message={message}
            onRegenerate={handleRegenerate}
            onFeedback={handleFeedback}
            onCopy={handleCopy}
            onFollowUp={handleFollowUp}
            isRegenerating={isRegenerating}
          />
        )}
      </div>

      {/* 发送状态 */}
      {isLast && status === "pending" && (
        <div className="self-center">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      )}
    </div>
  );
}
