"use client";

import { useState, useEffect } from "react";
import { WorldSetting } from "@/types/worldbuilding";
import * as db from "@/lib/db";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeographyEditor } from "./geography-editor";
import { SocietyEditor } from "./society-editor";
import { PowerSystemEditor } from "./power-system-editor";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface WorldBuilderProps {
  storyId: string;
}

export function WorldBuilder({ storyId }: WorldBuilderProps) {
  const [settings, setSettings] = useState<WorldSetting | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const worldSettings = await db.getWorldSettingByStoryId(storyId);
        setSettings(worldSettings || null);
      } catch (error) {
        console.error('Failed to load world settings:', error);
        toast({
          title: "错误",
          description: "加载世界观设定失败",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [storyId]);

  const handleSave = async (updatedSettings: WorldSetting) => {
    try {
      await db.updateWorldSetting(storyId, updatedSettings);
      setSettings(updatedSettings);
      toast({
        title: "成功",
        description: "世界观设定已保存",
      });
    } catch (error) {
      console.error('Failed to save world settings:', error);
      toast({
        title: "错误",
        description: "保存世界观设定失败",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>加载中...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">世界观设定</h2>
        <Button onClick={() => handleSave(settings!)}>保存</Button>
      </div>

      <Tabs defaultValue="geography" className="space-y-4">
        <TabsList>
          <TabsTrigger value="geography">地理</TabsTrigger>
          <TabsTrigger value="society">社会</TabsTrigger>
          <TabsTrigger value="power-system">力量体系</TabsTrigger>
        </TabsList>

        <TabsContent value="geography">
          <GeographyEditor
            data={settings?.geography}
            onChange={(geography) => handleSave({ geography })}
          />
        </TabsContent>

        <TabsContent value="society">
          <SocietyEditor
            data={settings?.society}
            onChange={(society) => handleSave({ society })}
          />
        </TabsContent>

        <TabsContent value="power-system">
          <PowerSystemEditor
            data={settings?.powerSystem}
            onChange={(powerSystem) => handleSave({ powerSystem })}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
