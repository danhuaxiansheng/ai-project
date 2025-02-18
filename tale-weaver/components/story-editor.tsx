"use client";

import { useState, useEffect, useRef } from "react";
import { useStory } from "@/contexts/story-context";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Send } from "lucide-react";
import { database } from "@/services/db";
import { Message } from "@/types/story";
import { MemoryGraph } from "@/components/memory-graph";

export function StoryEditor() {
  const { currentStory } = useStory();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // 加载消息历史
  useEffect(() => {
    async function loadMessages() {
      if (!currentStory) return;

      try {
        const storyMessages = await database.getStoryMessages(currentStory.id);
        setMessages(storyMessages);
      } catch (error) {
        console.error("Failed to load messages:", error);
        toast({
          title: "错误",
          description: "加载消息失败",
          variant: "destructive",
        });
      }
    }

    loadMessages();
  }, [currentStory, toast]);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStory || !input.trim() || isLoading) return;

    try {
      setIsLoading(true);

      // 创建用户消息
      const userMessage: Message = {
        id: crypto.randomUUID(),
        storyId: currentStory.id,
        role: "user",
        content: input.trim(),
        timestamp: Date.now(),
      };

      // 保存用户消息
      await database.addMessage(userMessage);
      setMessages((prev) => [...prev, userMessage]);
      setInput("");

      // TODO: 获取 AI 响应
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        storyId: currentStory.id,
        role: "assistant",
        content: "这是一个示例回复。实际开发中需要接入 AI API。",
        timestamp: Date.now(),
      };

      // 保存 AI 消息
      await database.addMessage(aiMessage);
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
      toast({
        title: "错误",
        description: "发送消息失败",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentStory) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        请先选择或创建一个故事
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入你的想法..."
            className="min-h-[80px]"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
