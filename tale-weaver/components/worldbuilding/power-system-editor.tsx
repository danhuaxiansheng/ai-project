"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash } from "lucide-react";
import { PowerRule } from "@/types/worldbuilding";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function PowerSystemEditor({ data, onChange }: any) {
  const [newRule, setNewRule] = useState<Partial<PowerRule>>({});

  const handleAddRule = () => {
    if (!newRule.name) return;

    const rule: PowerRule = {
      id: crypto.randomUUID(),
      name: newRule.name,
      description: newRule.description || "",
      effects: newRule.effects || [],
      costs: newRule.costs || [],
      limitations: newRule.limitations || [],
    };

    onChange({
      ...data,
      rules: [...(data?.rules || []), rule],
    });

    setNewRule({});
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-4">
        <h3 className="mb-4 font-medium">体系类型</h3>
        <Select
          value={data?.type || "magic"}
          onValueChange={(value) =>
            onChange({
              ...data,
              type: value,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="选择体系类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="magic">魔法体系</SelectItem>
            <SelectItem value="technology">科技体系</SelectItem>
            <SelectItem value="hybrid">混合体系</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">规则与限制</h3>
        {data?.rules?.map((rule: PowerRule) => (
          <div key={rule.id} className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{rule.name}</h4>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  onChange({
                    ...data,
                    rules: data.rules.filter(
                      (r: PowerRule) => r.id !== rule.id
                    ),
                  })
                }
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {rule.description}
            </p>
            <div className="mt-4 grid gap-4">
              <div>
                <span className="text-sm font-medium">效果：</span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {rule.effects.map((effect, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-primary/10 px-2 py-1 text-xs"
                    >
                      {effect}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-sm font-medium">代价：</span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {rule.costs.map((cost, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-destructive/10 px-2 py-1 text-xs"
                    >
                      {cost}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4 rounded-lg border p-4">
        <h4 className="font-medium">添加新规则</h4>
        <Input
          placeholder="规则名称"
          value={newRule.name || ""}
          onChange={(e) =>
            setNewRule((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <Textarea
          placeholder="规则描述"
          value={newRule.description || ""}
          onChange={(e) =>
            setNewRule((prev) => ({ ...prev, description: e.target.value }))
          }
        />
        <Input
          placeholder="效果（用逗号分隔）"
          value={newRule.effects?.join(",") || ""}
          onChange={(e) =>
            setNewRule((prev) => ({
              ...prev,
              effects: e.target.value.split(",").map((v) => v.trim()),
            }))
          }
        />
        <Input
          placeholder="代价（用逗号分隔）"
          value={newRule.costs?.join(",") || ""}
          onChange={(e) =>
            setNewRule((prev) => ({
              ...prev,
              costs: e.target.value.split(",").map((v) => v.trim()),
            }))
          }
        />
        <Button onClick={handleAddRule} disabled={!newRule.name}>
          <Plus className="mr-2 h-4 w-4" />
          添加规则
        </Button>
      </div>
    </div>
  );
}
