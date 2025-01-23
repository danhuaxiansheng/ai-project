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

const FOCUS_AREAS = [
  { value: "geography", label: "地理", description: "地形、气候、资源分布" },
  { value: "civilization", label: "文明", description: "社会、文化、技术发展" },
  { value: "history", label: "历史", description: "重大事件、时间线" },
  { value: "culture", label: "文化", description: "习俗、艺术、信仰" },
  { value: "religion", label: "宗教", description: "信仰体系、宗教组织" },
];

interface WorldGeneratorFormProps {
  onGenerated: (data: WorldData) => void;
}

export function WorldGeneratorForm({ onGenerated }: WorldGeneratorFormProps) {
  const [loading, setLoading] = useState(false);
  const [seed, setSeed] = useState("");
  const [complexity, setComplexity] = useState(5);
  const [focusAreas, setFocusAreas] = useState<string[]>([]);

  const handleAddFocusArea = (value: string) => {
    if (!focusAreas.includes(value)) {
      setFocusAreas([...focusAreas, value]);
    }
  };

  const handleRemoveFocusArea = (value: string) => {
    setFocusAreas(focusAreas.filter((area) => area !== value));
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
              <Label>随机种子 (可选)</Label>
              <Input
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                placeholder="留空则随机生成"
              />
              <p className="text-sm text-muted-foreground">
                使用相同的种子将生成相同的世界
              </p>
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
