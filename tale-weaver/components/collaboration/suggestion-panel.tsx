import { useState, useEffect } from "react";
import { CollaborationSession } from "@/services/session";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";

interface SuggestionPanelProps {
  session: CollaborationSession;
  onAcceptSuggestion: (messageId: string) => void;
  onRejectSuggestion: (messageId: string) => void;
}

export function SuggestionPanel({
  session,
  onAcceptSuggestion,
  onRejectSuggestion,
}: SuggestionPanelProps) {
  const [suggestions, setSuggestions] = useState<
    {
      id: string;
      content: string;
      timestamp: number;
      roleId: string;
      roleName: string;
      type?: string;
    }[]
  >([]);

  useEffect(() => {
    // 收集所有未处理的建议
    const allSuggestions = session.participants.flatMap((participant) =>
      participant.messages
        .filter((msg) => msg.metadata?.suggestion && !msg.metadata?.accepted)
        .map((msg) => ({
          id: msg.id,
          content: msg.content,
          timestamp: msg.timestamp,
          roleId: participant.role.id,
          roleName: participant.role.name,
          type: msg.metadata?.type,
        }))
    );

    setSuggestions(allSuggestions.sort((a, b) => b.timestamp - a.timestamp));
  }, [session]);

  if (suggestions.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        暂无未处理的建议
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 p-4">
        {suggestions.map((suggestion) => (
          <Card key={suggestion.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-sm">
                    {suggestion.roleName}
                  </span>
                  {suggestion.type && (
                    <span className="text-xs px-2 py-0.5 bg-secondary rounded">
                      {suggestion.type === "plot" && "情节建议"}
                      {suggestion.type === "dialogue" && "对话优化"}
                      {suggestion.type === "review" && "审查意见"}
                      {suggestion.type === "edit" && "编辑建议"}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(suggestion.timestamp, {
                      addSuffix: true,
                      locale: zhCN,
                    })}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">
                  {suggestion.content}
                </p>
              </div>
              <div className="flex gap-2 ml-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 text-green-600"
                  onClick={() => onAcceptSuggestion(suggestion.id)}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 text-red-600"
                  onClick={() => onRejectSuggestion(suggestion.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
