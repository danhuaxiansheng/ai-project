"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { AI_ROLES } from "@/config/ai";
import { useToast } from "@/components/ui/use-toast";
import { AIService } from "@/services/ai";
import { Loader2, Wand2 } from "lucide-react";

interface SettingCreatorProps {
  type: "world" | "character" | "plot" | "magic-system";
  initialContent?: string;
  onSave: (content: string) => void;
  onCancel?: () => void;
}

export function SettingCreator({
  type,
  initialContent = "",
  onSave,
  onCancel,
}: SettingCreatorProps) {
  const [content, setContent] = useState(initialContent);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const aiService = AIService.getInstance();

  // 获取AI建议
  const getAISuggestion = async () => {
    try {
      setIsGenerating(true);
      const prompt = `请帮我完善以下${getSettingTypeName(
        type
      )}设定：\n\n${content}`;

      const response = await aiService.generateResponse(
        AI_ROLES.STORY_BUILDER,
        [
          {
            role: "user",
            content: prompt,
          },
        ]
      );

      if (response?.content) {
        setContent((prev) => prev + "\n\n" + response.content);
      }

      toast({
        title: "已生成建议",
        description: "AI已为您提供了设定建议",
      });
    } catch (error) {
      toast({
        title: "生成失败",
        description: "获取AI建议时出错",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // 获取设定类型的中文名称
  const getSettingTypeName = (type: string) => {
    const typeNames = {
      world: "世界观",
      character: "角色",
      plot: "剧情",
      "magic-system": "魔法体系",
    };
    return typeNames[type as keyof typeof typeNames] || type;
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-muted rounded-lg">
        <h3 className="text-lg font-medium mb-2">
          {getSettingTypeName(type)}设定
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          在下方编辑器中输入设定内容，可以随时获取 AI 的建议和完善。
        </p>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`请输入${getSettingTypeName(type)}设定内容...`}
          className="min-h-[300px] mb-4"
        />
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={getAISuggestion}
              disabled={isGenerating || !content.trim()}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  获取AI建议
                </>
              )}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => onCancel?.()}>
              取消
            </Button>
            <Button onClick={() => onSave(content)} disabled={!content.trim()}>
              保存设定
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
