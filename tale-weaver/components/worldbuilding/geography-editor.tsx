"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash } from "lucide-react";
import { Region } from "@/types/worldbuilding";

export function GeographyEditor({ data, onChange }: any) {
  const [newRegion, setNewRegion] = useState<Partial<Region>>({});

  const handleAddRegion = () => {
    if (!newRegion.name) return;

    const region: Region = {
      id: crypto.randomUUID(),
      name: newRegion.name,
      description: newRegion.description || "",
      climate: newRegion.climate || "",
      terrain: newRegion.terrain || "",
      resources: [],
      cultures: [],
    };

    onChange({
      ...data,
      regions: [...(data?.regions || []), region],
    });

    setNewRegion({});
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">地区</h3>
        {data?.regions?.map((region: Region) => (
          <div key={region.id} className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{region.name}</h4>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  onChange({
                    ...data,
                    regions: data.regions.filter(
                      (r: Region) => r.id !== region.id
                    ),
                  })
                }
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {region.description}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium">气候：</span>
                <span className="text-sm">{region.climate}</span>
              </div>
              <div>
                <span className="text-sm font-medium">地形：</span>
                <span className="text-sm">{region.terrain}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4 rounded-lg border p-4">
        <h4 className="font-medium">添加新地区</h4>
        <Input
          placeholder="地区名称"
          value={newRegion.name || ""}
          onChange={(e) =>
            setNewRegion((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <Textarea
          placeholder="地区描述"
          value={newRegion.description || ""}
          onChange={(e) =>
            setNewRegion((prev) => ({ ...prev, description: e.target.value }))
          }
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder="气候特征"
            value={newRegion.climate || ""}
            onChange={(e) =>
              setNewRegion((prev) => ({ ...prev, climate: e.target.value }))
            }
          />
          <Input
            placeholder="地形特征"
            value={newRegion.terrain || ""}
            onChange={(e) =>
              setNewRegion((prev) => ({ ...prev, terrain: e.target.value }))
            }
          />
        </div>
        <Button onClick={handleAddRegion} disabled={!newRegion.name}>
          <Plus className="mr-2 h-4 w-4" />
          添加地区
        </Button>
      </div>
    </div>
  );
}
