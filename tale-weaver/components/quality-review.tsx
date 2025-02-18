"use client";

import { useState } from "react";
import { useStory } from "@/contexts/story-context";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Star } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { database } from "@/services/db";

export function QualityReview() {
  const { currentStory } = useStory();
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewResults, setReviewResults] = useState<any>(null);
  const { toast } = useToast();

  const handleReview = async () => {
    if (!currentStory) return;

    try {
      setIsReviewing(true);
      // 获取当前故事的所有消息
      const messages = await database.getStoryMessages(currentStory.id);

      if (!messages.length) {
        toast({
          title: "提示",
          description: "当前故事还没有内容可以审查",
        });
        return;
      }

      // TODO: 实现质量审查逻辑
      const results = {
        coherence: 0.85,
        style: 0.78,
        engagement: 0.92,
        suggestions: [
          "考虑增加更多环境描写",
          "对话可以更自然一些",
          "情节转折可以更流畅",
        ],
      };

      setReviewResults(results);

      toast({
        title: "成功",
        description: "质量审查完成",
      });
    } catch (error) {
      console.error("Review failed:", error);
      toast({
        title: "错误",
        description: "质量审查失败",
        variant: "destructive",
      });
    } finally {
      setIsReviewing(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={!currentStory || isReviewing}
          onClick={handleReview}
        >
          {isReviewing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Star className="h-4 w-4" />
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>质量审查</SheetTitle>
          <SheetDescription>
            AI 将从多个维度评估故事质量，并提供改进建议
          </SheetDescription>
        </SheetHeader>

        {reviewResults && (
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">一致性评分</div>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${reviewResults.coherence * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">文风评分</div>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${reviewResults.style * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">趣味性评分</div>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${reviewResults.engagement * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">改进建议</div>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {reviewResults.suggestions.map(
                  (suggestion: string, i: number) => (
                    <li key={i}>{suggestion}</li>
                  )
                )}
              </ul>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
