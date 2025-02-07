import { cn } from "@/lib/utils";
import { Message } from "@/types/message";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

interface ChatMessageProps {
  message: Message;
  isLast?: boolean;
}

export function ChatMessage({ message, isLast }: ChatMessageProps) {
  const { role, content, timestamp, status } = message;

  return (
    <div className="flex gap-3 group">
      {/* 角色图标 */}
      <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
        <role.icon className="w-4 h-4" />
      </div>

      {/* 消息内容 */}
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{role.name}</span>
          <span className="text-xs text-muted-foreground">
            {format(timestamp, "HH:mm:ss")}
          </span>
        </div>
        <div className="text-sm">{content}</div>
      </div>

      {/* 发送状态 */}
      {isLast && status === "sending" && (
        <div className="self-center">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      )}
    </div>
  );
}
