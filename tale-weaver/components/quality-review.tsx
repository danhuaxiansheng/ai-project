"use client";

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ClipboardCheck, Loader2 } from "lucide-react";
import { reviewContent } from "@/services/review";
import { useStory } from "@/contexts/story-context";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

export function QualityReview() {
  const { state } = useStory();
  const { toast } = useToast();
  const [isReviewing, setIsReviewing] = React.useState(false);
  const [reviewResult, setReviewResult] = React.useState<ReviewResult | null>(
    null
  );

  const handleReview = async () => {
    if (!state.messages.length || !state.selectedRole) return;

    setIsReviewing(true);
    try {
      const lastMessage = state.messages[state.messages.length - 1];
      const context = state.messages
        .slice(0, -1)
        .map((msg) => `${msg.role}: ${msg.content}`)
        .join("\n");

      const result = await reviewContent(
        lastMessage.content,
        state.selectedRole,
        context
      );
      setReviewResult(result);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "内容审核失败，请稍后重试",
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
          disabled={!state.messages.length || isReviewing}
          onClick={handleReview}
        >
          {isReviewing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ClipboardCheck className="h-4 w-4" />
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>质量评估</SheetTitle>
          <SheetDescription>
            对最近一条内容的质量进行多维度评估
          </SheetDescription>
        </SheetHeader>
        {reviewResult && (
          <div className="mt-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>逻辑一致性</span>
                  <span>{reviewResult.metrics.logicConsistency}/10</span>
                </div>
                <Progress
                  value={reviewResult.metrics.logicConsistency * 10}
                  className="h-2"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>文风匹配度</span>
                  <span>{reviewResult.metrics.styleMatching}/10</span>
                </div>
                <Progress
                  value={reviewResult.metrics.styleMatching * 10}
                  className="h-2"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>观赏度</span>
                  <span>{reviewResult.metrics.engagement}/10</span>
                </div>
                <Progress
                  value={reviewResult.metrics.engagement * 10}
                  className="h-2"
                />
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">改进建议</h4>
              <ul className="list-disc pl-4 space-y-1">
                {reviewResult.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">总体评分</span>
                <span className="text-2xl font-bold">
                  {reviewResult.overallScore}/10
                </span>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
