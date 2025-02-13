"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { ChatMessage } from "@/components/chat-message";
import { useStory } from "@/contexts/story-context";
import { generateAIResponse } from "@/services/ai";
import { useToast } from "@/hooks/use-toast";

export function StoryEditor() {
  const { state, dispatch } = useStory();
  const [content, setContent] = React.useState("");
  const { toast } = useToast();

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
    <Card className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {state.messages.map((message, index) => (
          <ChatMessage key={message.timestamp} {...message} />
        ))}
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
            disabled={!state.selectedRole}
          />
          <Button
            type="submit"
            className="self-end"
            disabled={state.isLoading || !content.trim() || !state.selectedRole}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">发送</span>
          </Button>
        </form>
      </div>
    </Card>
  );
}
