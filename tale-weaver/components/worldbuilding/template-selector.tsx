"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WORLD_TEMPLATES } from "@/config/world-templates";
import { WorldSetting } from "@/types/worldbuilding";

interface TemplateSelectorProps {
  onSelect: (template: WorldSetting) => void;
}

export function TemplateSelector({ onSelect }: TemplateSelectorProps) {
  const [open, setOpen] = useState(false);

  const handleSelectTemplate = (templateId: keyof typeof WORLD_TEMPLATES) => {
    const template = WORLD_TEMPLATES[templateId];
    const worldSetting: WorldSetting = {
      id: crypto.randomUUID(),
      storyId: "", // 需要在使用时设置
      name: template.name,
      description: template.description,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      geography: template.geography,
      society: template.society,
      powerSystem: template.powerSystem,
    };

    onSelect(worldSetting);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">使用模板</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>选择世界观模板</DialogTitle>
          <DialogDescription>
            选择一个预设模板快速开始创建你的世界观
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="grid gap-4 p-4">
            {Object.entries(WORLD_TEMPLATES).map(([id, template]) => (
              <div
                key={id}
                className="cursor-pointer rounded-lg border p-4 transition-colors hover:bg-accent"
                onClick={() =>
                  handleSelectTemplate(id as keyof typeof WORLD_TEMPLATES)
                }
              >
                <h4 className="font-medium">{template.name}</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  {template.description}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <div className="rounded-full bg-primary/10 px-2 py-1 text-xs">
                    {template.powerSystem.type}
                  </div>
                  <div className="rounded-full bg-primary/10 px-2 py-1 text-xs">
                    {template.society.politics.type}
                  </div>
                  <div className="rounded-full bg-primary/10 px-2 py-1 text-xs">
                    {`${template.geography.regions.length} 个地区`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
