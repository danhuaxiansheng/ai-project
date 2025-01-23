"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { MultiSelect } from "@/components/ui/multi-select";
import { worldApi, type WorldData } from "@/lib/api/world";
import { toast } from "@/components/ui/use-toast";

const FOCUS_AREAS = [
  { value: "geography", label: "地理" },
  { value: "civilization", label: "文明" },
  { value: "history", label: "历史" },
  { value: "culture", label: "文化" },
  { value: "religion", label: "宗教" },
];

export function WorldGeneratorForm() {
  const [loading, setLoading] = useState(false);
  const [seed, setSeed] = useState("");
  const [complexity, setComplexity] = useState(5);
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [result, setResult] = useState<WorldData | null>(null);

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
      setResult(data);
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
      <div className="space-y-2">
        <label>随机种子 (可选)</label>
        <Input
          value={seed}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSeed(e.target.value)
          }
          placeholder="留空则随机生成"
        />
      </div>

      <div className="space-y-2">
        <label>复杂度 (1-10)</label>
        <Slider
          value={[complexity]}
          onValueChange={([value]: number[]) => setComplexity(value)}
          min={1}
          max={10}
          step={1}
        />
      </div>

      <div className="space-y-2">
        <label>重点领域</label>
        <MultiSelect
          options={FOCUS_AREAS}
          value={focusAreas}
          onChange={setFocusAreas}
          placeholder="选择重点生成的领域"
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "生成中..." : "开始生成"}
      </Button>

      {result && (
        <div className="mt-8">
          <h3 className="text-lg font-bold">生成结果</h3>
          <pre className="mt-2 p-4 bg-gray-100 rounded-lg overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </form>
  );
}
