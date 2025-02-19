"use client";

import { useState, useEffect } from "react";
import { useStory } from "@/contexts/story-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorldSetting } from "@/types/worldbuilding";
import { GeographyEditor } from "./geography-editor";
import { SocietyEditor } from "./society-editor";
import { PowerSystemEditor } from "./power-system-editor";
import { KnowledgeGraph } from "./knowledge-graph";
import { useToast } from "@/components/ui/use-toast";
import { database } from "@/services/db";
import { TemplateSelector } from "./template-selector";
import { Button } from "@/components/ui/button";

export function WorldBuilder() {
  const { currentStory } = useStory();
  const [worldSetting, setWorldSetting] = useState<WorldSetting | null>(null);
  const [activeTab, setActiveTab] = useState("geography");
  const { toast } = useToast();

  useEffect(() => {
    async function loadWorldSetting() {
      if (!currentStory) return;

      try {
        const setting = await database.getWorldSetting(currentStory.id);
        setWorldSetting(setting);
      } catch (error) {
        console.error("Failed to load world setting:", error);
        toast({
          title: "错误",
          description: "加载世界观设定失败",
          variant: "destructive",
        });
      }
    }

    loadWorldSetting();
  }, [currentStory, toast]);

  const handleSave = async () => {
    if (!currentStory || !worldSetting) return;

    try {
      await database.updateWorldSetting(worldSetting);
      await database.createSettingVersion(worldSetting);
      toast({
        title: "成功",
        description: "世界观设定已保存",
      });
    } catch (error) {
      console.error("Failed to save world setting:", error);
      toast({
        title: "错误",
        description: "保存世界观设定失败",
        variant: "destructive",
      });
    }
  };

  const handleTemplateSelect = async (template: WorldSetting) => {
    if (!currentStory) return;

    try {
      const newSetting = {
        ...template,
        storyId: currentStory.id,
      };

      await database.createWorldSetting(newSetting);
      setWorldSetting(newSetting);
      toast({
        title: "成功",
        description: "已创建新的世界观设定",
      });
    } catch (error) {
      console.error("Failed to create world setting:", error);
      toast({
        title: "错误",
        description: "创建世界观设定失败",
        variant: "destructive",
      });
    }
  };

  if (!currentStory) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        请先选择或创建一个故事
      </div>
    );
  }

  return (
    <div className="flex h-full gap-4">
      {/* 左侧编辑区 */}
      <div className="w-2/3 rounded-lg border bg-card p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">世界观构建</h2>
          <div className="flex gap-2">
            <TemplateSelector onSelect={handleTemplateSelect} />
            <Button onClick={handleSave}>保存</Button>
          </div>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="geography">地理体系</TabsTrigger>
            <TabsTrigger value="society">社会体系</TabsTrigger>
            <TabsTrigger value="power">魔法科技</TabsTrigger>
          </TabsList>
          <TabsContent value="geography">
            <GeographyEditor
              data={worldSetting?.geography}
              onChange={(geography) =>
                setWorldSetting((prev) =>
                  prev ? { ...prev, geography } : null
                )
              }
            />
          </TabsContent>
          <TabsContent value="society">
            <SocietyEditor
              data={worldSetting?.society}
              onChange={(society) =>
                setWorldSetting((prev) => (prev ? { ...prev, society } : null))
              }
            />
          </TabsContent>
          <TabsContent value="power">
            <PowerSystemEditor
              data={worldSetting?.powerSystem}
              onChange={(powerSystem) =>
                setWorldSetting((prev) =>
                  prev ? { ...prev, powerSystem } : null
                )
              }
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* 右侧知识图谱 */}
      <div className="w-1/3 rounded-lg border bg-card p-4">
        <KnowledgeGraph data={worldSetting} />
      </div>
    </div>
  );
}
