"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash } from "lucide-react";
import { Culture } from "@/types/worldbuilding";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function SocietyEditor({ data, onChange }: any) {
  const [newCulture, setNewCulture] = useState<Partial<Culture>>({});
  const [expandedSection, setExpandedSection] = useState<string>("cultures");

  const handleAddCulture = () => {
    if (!newCulture.name) return;

    const culture: Culture = {
      id: crypto.randomUUID(),
      name: newCulture.name,
      description: newCulture.description || "",
      values: newCulture.values || [],
      customs: newCulture.customs || [],
      languages: newCulture.languages || [],
      regions: [],
    };

    onChange({
      ...data,
      cultures: [...(data?.cultures || []), culture],
    });

    setNewCulture({});
  };

  return (
    <div className="space-y-6">
      <Accordion
        type="single"
        value={expandedSection}
        onValueChange={setExpandedSection}
      >
        <AccordionItem value="cultures">
          <AccordionTrigger>文化</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-4">
              {data?.cultures?.map((culture: Culture) => (
                <div key={culture.id} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{culture.name}</h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        onChange({
                          ...data,
                          cultures: data.cultures.filter(
                            (c: Culture) => c.id !== culture.id
                          ),
                        })
                      }
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {culture.description}
                  </p>
                  <div className="mt-4 grid gap-4">
                    <div>
                      <span className="text-sm font-medium">价值观：</span>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {culture.values.map((value, index) => (
                          <span
                            key={index}
                            className="rounded-full bg-primary/10 px-2 py-1 text-xs"
                          >
                            {value}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium">习俗：</span>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {culture.customs.map((custom, index) => (
                          <span
                            key={index}
                            className="rounded-full bg-primary/10 px-2 py-1 text-xs"
                          >
                            {custom}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="space-y-4 rounded-lg border p-4">
                <h4 className="font-medium">添加新文化</h4>
                <Input
                  placeholder="文化名称"
                  value={newCulture.name || ""}
                  onChange={(e) =>
                    setNewCulture((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
                <Textarea
                  placeholder="文化描述"
                  value={newCulture.description || ""}
                  onChange={(e) =>
                    setNewCulture((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
                <Input
                  placeholder="价值观（用逗号分隔）"
                  value={newCulture.values?.join(",") || ""}
                  onChange={(e) =>
                    setNewCulture((prev) => ({
                      ...prev,
                      values: e.target.value.split(",").map((v) => v.trim()),
                    }))
                  }
                />
                <Input
                  placeholder="习俗（用逗号分隔）"
                  value={newCulture.customs?.join(",") || ""}
                  onChange={(e) =>
                    setNewCulture((prev) => ({
                      ...prev,
                      customs: e.target.value.split(",").map((c) => c.trim()),
                    }))
                  }
                />
                <Button onClick={handleAddCulture} disabled={!newCulture.name}>
                  <Plus className="mr-2 h-4 w-4" />
                  添加文化
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 其他社会体系部分（政治、经济、宗教等）可以类似实现 */}
      </Accordion>
    </div>
  );
}
