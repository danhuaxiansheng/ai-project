"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { worldApi, type WorldData } from "@/lib/api/world";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { World } from "@/lib/types";

const FOCUS_AREAS = [
  { value: "geography", label: "地理", description: "地形、气候、资源分布" },
  { value: "civilization", label: "文明", description: "社会、文化、技术发展" },
  { value: "history", label: "历史", description: "重大事件、时间线" },
  { value: "culture", label: "文化", description: "习俗、艺术、信仰" },
  { value: "religion", label: "宗教", description: "信仰体系、宗教组织" },
];

interface WorldGeneratorFormProps {
  onGenerated: (world: World) => void;
  initialState?: {
    prompt: string;
    seed: string;
    complexity: number;
    focusAreas: string[];
  };
  onStateChange?: (state: {
    prompt: string;
    seed: string;
    complexity: number;
    focusAreas: string[];
  }) => void;
}

export function WorldGeneratorForm({
  onGenerated,
  initialState,
  onStateChange,
}: WorldGeneratorFormProps) {
  const [loading, setLoading] = useState(false);
  const [seed, setSeed] = useState(initialState?.seed || "");
  const [prompt, setPrompt] = useState(initialState?.prompt || "");
  const [complexity, setComplexity] = useState(initialState?.complexity || 5);
  const [focusAreas, setFocusAreas] = useState<string[]>(
    initialState?.focusAreas || FOCUS_AREAS.map((area) => area.value)
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recentSeeds, setRecentSeeds] = useState<
    Array<{ seed: string; timestamp: string }>
  >([]);

  // 当表单状态改变时通知父组件
  useEffect(() => {
    onStateChange?.({
      prompt,
      seed,
      complexity,
      focusAreas,
    });
  }, [prompt, seed, complexity, focusAreas, onStateChange]);

  const handleAddFocusArea = (value: string) => {
    if (!focusAreas.includes(value)) {
      setFocusAreas([...focusAreas, value]);
    }
  };

  const handleRemoveFocusArea = (value: string) => {
    setFocusAreas(focusAreas.filter((area) => area !== value));
  };

  const handleAnalyzePrompt = async () => {
    const promptText = prompt.trim();
    if (!promptText) {
      toast({
        title: "提示",
        description: "请先输入世界观描述",
        variant: "default",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const data = await worldApi.analyzePrompt(promptText);

      // 只在有建议值时更新对应字段
      if (data.suggestedSeed) setSeed(data.suggestedSeed);
      if (data.suggestedComplexity) setComplexity(data.suggestedComplexity);
      if (data.suggestedFocusAreas && data.suggestedFocusAreas.length > 0) {
        // 合并现有选择和建议的领域，去重
        const newFocusAreas = Array.from(
          new Set([...focusAreas, ...data.suggestedFocusAreas])
        );
        setFocusAreas(newFocusAreas);
      }

      toast({
        title: "分析完成",
        description: "已根据描述调整生成参数",
      });
    } catch (error) {
      toast({
        title: "错误",
        description: "分析失败，请重试",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (focusAreas.length === 0) {
      toast({
        title: "错误",
        description: "请至少选择一个重点领域",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const data = await worldApi.generateWorld({
        seed,
        complexity,
        focus_areas: focusAreas,
        additional_params: {
          prompt: prompt.trim() || undefined,
        },
      });
      onGenerated(data);
      toast({
        title: "成功",
        description: "世界生成完成！",
      });
    } catch (error: any) {
      console.error("Generation error:", error);
      toast({
        title: "错误",
        description: error.response?.data?.detail || "生成失败，请重试",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>世界观描述</Label>
              <div className="space-y-2">
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="描述你想要创造的世界，例如：一个被魔法和科技共同支配的世界，有着浮空城市和地下文明..."
                  className="min-h-[120px] resize-none"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAnalyzePrompt}
                  disabled={isAnalyzing || !prompt.trim()}
                  className="w-full"
                >
                  {isAnalyzing ? "分析中..." : "分析描述并调整参数"}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>世界种子</Label>
              <Input
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                placeholder="留空则随机生成"
              />
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  世界种子决定了生成结果的唯一性。使用相同的种子将生成相同的世界。
                </p>
                {recentSeeds.length > 0 && (
                  <>
                    <p className="text-sm text-muted-foreground mt-4">
                      历史记录：
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {recentSeeds.map(({ seed: historySeed, timestamp }) => (
                        <Button
                          key={historySeed}
                          variant="outline"
                          size="sm"
                          onClick={() => setSeed(historySeed)}
                          type="button"
                          className="group"
                        >
                          <span>{historySeed}</span>
                          <span className="text-xs text-muted-foreground ml-2 opacity-0 group-hover:opacity-100">
                            {new Date(timestamp).toLocaleString()}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>世界复杂度</Label>
                <span className="text-sm text-muted-foreground">
                  {complexity}/10
                </span>
              </div>
              <Slider
                value={[complexity]}
                onValueChange={([value]) => setComplexity(value)}
                min={1}
                max={10}
                step={1}
                className="my-4"
              />
              <p className="text-sm text-muted-foreground">
                复杂度越高，生成的世界细节越丰富
              </p>
            </div>

            <div className="space-y-4">
              <Label>重点领域</Label>
              <div className="flex flex-wrap gap-2">
                {FOCUS_AREAS.map((area) => (
                  <Badge
                    key={area.value}
                    variant={
                      focusAreas.includes(area.value) ? "default" : "outline"
                    }
                    className="cursor-pointer select-none"
                    onClick={() => {
                      if (focusAreas.includes(area.value)) {
                        if (focusAreas.length > 1) {
                          handleRemoveFocusArea(area.value);
                        }
                      } else {
                        handleAddFocusArea(area.value);
                      }
                    }}
                  >
                    {area.label}
                    <span className="ml-1 text-xs text-muted-foreground">
                      {area.description}
                    </span>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "生成中..." : "开始生成"}
      </Button>
    </form>
  );
}
