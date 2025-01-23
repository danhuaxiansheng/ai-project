"use client";

import { useState } from "react";
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

const FOCUS_AREAS = [
  { value: "geography", label: "地理", description: "地形、气候、资源分布" },
  { value: "civilization", label: "文明", description: "社会、文化、技术发展" },
  { value: "history", label: "历史", description: "重大事件、时间线" },
  { value: "culture", label: "文化", description: "习俗、艺术、信仰" },
  { value: "religion", label: "宗教", description: "信仰体系、宗教组织" },
];

const SEED_EXAMPLES = [
  "fantasy-2024",
  "medieval-world",
  "future-earth",
  "magic-realm",
];

interface WorldGeneratorFormProps {
  onGenerated: (data: WorldData) => void;
}

export function WorldGeneratorForm({ onGenerated }: WorldGeneratorFormProps) {
  const [loading, setLoading] = useState(false);
  const [seed, setSeed] = useState("");
  const [prompt, setPrompt] = useState("");
  const [complexity, setComplexity] = useState(5);
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAddFocusArea = (value: string) => {
    if (!focusAreas.includes(value)) {
      setFocusAreas([...focusAreas, value]);
    }
  };

  const handleRemoveFocusArea = (value: string) => {
    setFocusAreas(focusAreas.filter((area) => area !== value));
  };

  const handleAnalyzePrompt = async () => {
    if (!prompt.trim()) {
      toast({
        title: "提示",
        description: "请输入世界观描述",
        variant: "default",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const data = await worldApi.analyzePrompt(prompt);
      // 根据分析结果设置表单值
      if (data.suggestedSeed) setSeed(data.suggestedSeed);
      if (data.suggestedComplexity) setComplexity(data.suggestedComplexity);
      if (data.suggestedFocusAreas) setFocusAreas(data.suggestedFocusAreas);

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
        focusAreas,
      });
      onGenerated(data);
      toast({
        title: "成功",
        description: "世界生成完成！",
      });
    } catch (error) {
      toast({
        title: "错误",
        description: "生成失败，请重试",
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
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>世界观描述</Label>
              <div className="space-y-2">
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="描述你想要创造的世界，例如：一个被魔法和科技共同支配的世界，有着浮空城市和地下文明..."
                  className="min-h-[120px]"
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
                placeholder="例如: fantasy-2024"
              />
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  世界种子决定了生成结果的唯一性。使用相同的种子将生成相同的世界。
                </p>
                <div className="flex flex-wrap gap-2">
                  <p className="text-sm text-muted-foreground">示例种子：</p>
                  {SEED_EXAMPLES.map((example) => (
                    <Button
                      key={example}
                      variant="outline"
                      size="sm"
                      onClick={() => setSeed(example)}
                      type="button"
                    >
                      {example}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>世界复杂度 (1-10)</Label>
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

            <div className="space-y-2">
              <Label>重点领域</Label>
              <Select onValueChange={handleAddFocusArea}>
                <SelectTrigger>
                  <SelectValue placeholder="选择重点生成的领域" />
                </SelectTrigger>
                <SelectContent>
                  {FOCUS_AREAS.map((area) => (
                    <SelectItem
                      key={area.value}
                      value={area.value}
                      disabled={focusAreas.includes(area.value)}
                    >
                      <div className="flex flex-col">
                        <span>{area.label}</span>
                        <span className="text-sm text-muted-foreground">
                          {area.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex flex-wrap gap-2 mt-2">
                {focusAreas.map((area) => {
                  const areaInfo = FOCUS_AREAS.find((a) => a.value === area);
                  return (
                    <Badge
                      key={area}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleRemoveFocusArea(area)}
                    >
                      {areaInfo?.label} ✕
                    </Badge>
                  );
                })}
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
