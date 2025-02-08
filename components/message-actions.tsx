import { Message } from "@/types/message";
import { Button } from "./ui/button";
import {
  RotateCw,
  ThumbsUp,
  ThumbsDown,
  Copy,
  MessageSquarePlus,
} from "lucide-react";
import { toast } from "sonner";

interface MessageActionsProps {
  message: Message;
  onRegenerate: () => void;
  onFeedback: (type: "positive" | "negative") => void;
  onCopy: () => void;
  onFollowUp: () => void;
  isRegenerating?: boolean;
}

export function MessageActions({
  message,
  onRegenerate,
  onFeedback,
  onCopy,
  onFollowUp,
  isRegenerating,
}: MessageActionsProps) {
  if (message.type === "user") return null;

  return (
    <div className="flex items-center gap-2 mt-2 text-muted-foreground">
      <Button
        variant="ghost"
        size="sm"
        onClick={onRegenerate}
        disabled={isRegenerating}
      >
        <RotateCw
          className={`w-4 h-4 mr-2 ${isRegenerating ? "animate-spin" : ""}`}
        />
        重新生成
      </Button>
      <Button variant="ghost" size="sm" onClick={() => onFeedback("positive")}>
        <ThumbsUp className="w-4 h-4 mr-2" />
        有帮助
      </Button>
      <Button variant="ghost" size="sm" onClick={() => onFeedback("negative")}>
        <ThumbsDown className="w-4 h-4 mr-2" />
        需改进
      </Button>
      <Button variant="ghost" size="sm" onClick={onCopy}>
        <Copy className="w-4 h-4 mr-2" />
        复制
      </Button>
      <Button variant="ghost" size="sm" onClick={onFollowUp}>
        <MessageSquarePlus className="w-4 h-4 mr-2" />
        追问
      </Button>
    </div>
  );
}
