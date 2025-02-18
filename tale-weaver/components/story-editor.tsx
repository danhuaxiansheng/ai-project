"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { ChatMessage } from "@/components/chat-message";
import { useStory } from "@/contexts/story-context";
import { generateAIResponse } from "@/services/ai";
import { useToast } from "@/hooks/use-toast";
import { MemoryGraph } from "@/components/memory-graph";

export function StoryEditor() {
  const { state, dispatch } = useStory();
  const [content, setContent] = React.useState("");
  const { toast } = useToast();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // 自动滚动到最新消息
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || state.isLoading || !state.selectedRole) return;

    const userMessage = {
      role: "user",
      content: content.trim(),
      timestamp: Date.now(),
    };

    dispatch({ type: "ADD_MESSAGE", payload: userMessage });
    setContent("");
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const aiResponse = await generateAIResponse(state.selectedRole, [
        ...state.messages,
        userMessage,
      ]);

      dispatch({
        type: "ADD_MESSAGE",
        payload: {
          ...aiResponse,
          timestamp: Date.now(),
        },
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "错误",
        description: "生成回应时出现错误，请稍后重试",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="flex flex-col h-[calc(100vh-20rem)]">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {state.messages.map((message) => (
            <ChatMessage key={message.timestamp} {...message} />
          ))}
          {state.isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>AI 正在思考...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Textarea
              placeholder={
                state.selectedRole
                  ? "在这里开始你的故事..."
                  : "请先选择一个 AI 角色"
              }
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[80px]"
              disabled={!state.selectedRole || state.isLoading}
            />
            <Button
              type="submit"
              className="self-end"
              disabled={
                state.isLoading || !content.trim() || !state.selectedRole
              }
            >
              {state.isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="sr-only">发送</span>
            </Button>
          </form>
        </div>
      </Card>

      <div className="bg-card rounded-lg p-4">
        <h3 className="text-lg font-medium mb-4">记忆图谱</h3>
        <MemoryGraph />
      </div>
    </div>
  );
}
