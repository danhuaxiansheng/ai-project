import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatMessageProps {
  role: "assistant" | "user";
  content: string;
  avatar?: string;
}

export function ChatMessage({ role, content, avatar }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex gap-3 p-4",
        role === "assistant" ? "bg-muted/50" : "bg-background"
      )}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatar} />
        <AvatarFallback>{role === "assistant" ? "AI" : "你"}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2">
        <p className="text-sm">{content}</p>
      </div>
    </div>
  );
}
