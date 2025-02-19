"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Node } from "./knowledge-graph";
import { WorldSetting } from "@/types/worldbuilding";

interface NodeDetailsProps {
  node: Node | null;
  worldSetting: WorldSetting | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NodeDetailsDialog({
  node,
  worldSetting,
  open,
  onOpenChange,
}: NodeDetailsProps) {
  if (!node || !worldSetting) return null;

  const getNodeDetails = () => {
    switch (node.type) {
      case "region":
        const region = worldSetting.geography.regions.find(
          (r) => r.id === node.id
        );
        return region ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {region.description}
            </p>
            <div className="space-y-2">
              <div className="text-sm font-medium">气候</div>
              <Badge variant="outline">{region.climate}</Badge>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">地形</div>
              <Badge variant="outline">{region.terrain}</Badge>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">资源</div>
              <div className="flex flex-wrap gap-2">
                {region.resources.map((resource, index) => (
                  <Badge key={index} variant="outline">
                    {resource}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ) : null;

      case "culture":
        const culture = worldSetting.society.cultures.find(
          (c) => c.id === node.id
        );
        return culture ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {culture.description}
            </p>
            <div className="space-y-2">
              <div className="text-sm font-medium">价值观</div>
              <div className="flex flex-wrap gap-2">
                {culture.values.map((value, index) => (
                  <Badge key={index} variant="outline">
                    {value}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">习俗</div>
              <div className="flex flex-wrap gap-2">
                {culture.customs.map((custom, index) => (
                  <Badge key={index} variant="outline">
                    {custom}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ) : null;

      case "rule":
        const rule = worldSetting.powerSystem.rules.find(
          (r) => r.id === node.id
        );
        return rule ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{rule.description}</p>
            <div className="space-y-2">
              <div className="text-sm font-medium">效果</div>
              <div className="flex flex-wrap gap-2">
                {rule.effects.map((effect, index) => (
                  <Badge key={index} variant="outline">
                    {effect}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">代价</div>
              <div className="flex flex-wrap gap-2">
                {rule.costs.map((cost, index) => (
                  <Badge key={index} variant="outline" className="bg-red-50">
                    {cost}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ) : null;

      case "artifact":
        const artifact = worldSetting.powerSystem.artifacts.find(
          (a) => a.id === node.id
        );
        return artifact ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {artifact.description}
            </p>
            <div className="space-y-2">
              <div className="text-sm font-medium">类型</div>
              <Badge variant="outline">{artifact.type}</Badge>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">能力</div>
              <div className="flex flex-wrap gap-2">
                {artifact.powers.map((power, index) => (
                  <Badge key={index} variant="outline">
                    {power}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">来源</div>
              <p className="text-sm">{artifact.origin}</p>
            </div>
            {artifact.currentLocation && (
              <div className="space-y-2">
                <div className="text-sm font-medium">当前位置</div>
                <p className="text-sm">{artifact.currentLocation}</p>
              </div>
            )}
          </div>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: node.color }}
            />
            {node.name}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="p-4">{getNodeDetails()}</div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
