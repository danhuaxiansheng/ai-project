"use client";

import { useState, useEffect } from "react";
import { SettingEditor } from "@/components/setting/setting-editor";
import { SettingCreator } from "@/components/setting/setting-creator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { Setting } from "@/types/setting";
import { useToast } from "@/components/ui/use-toast";
import { WorldSettingForm } from "@/components/worldbuilding/world-setting-form";

interface SettingsPageProps {
  params: {
    id: string;
  };
}

export default function SettingsPage({ params }: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState("world");
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch(
          `/api/db?action=getSettings&storyId=${params.id}`
        );
        const data = await response.json();
        setSettings(data || {});
      } catch (error) {
        console.error("加载设定失败:", error);
      }
    };
    loadSettings();
  }, [params.id]);

  const handleSave = async (type: string, content: string) => {
    try {
      const response = await fetch("/api/db", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "updateSettings",
          storyId: params.id,
          type,
          content,
        }),
      });

      if (!response.ok) throw new Error("保存失败");

      setSettings((prev) => ({
        ...prev,
        [type]: content,
      }));
      setIsCreating(false);

      toast({
        title: "保存成功",
        description: "设定已更新",
      });
    } catch (error) {
      toast({
        title: "保存失败",
        description: "无法保存设定",
        variant: "destructive",
      });
    }
  };

  const renderSettingContent = (type: string, setting?: string) => {
    if (type === "world") {
      return <WorldSettingForm storyId={params.id} onSave={() => {}} />;
    }

    if (isCreating) {
      return (
        <SettingCreator
          type={type as "world" | "character" | "plot" | "magic-system"}
          initialContent={setting || ""}
          onSave={(content) => handleSave(type, content)}
        />
      );
    }

    if (setting) {
      return (
        <div className="space-y-4">
          <div className="prose dark:prose-invert max-w-none">
            <pre className="whitespace-pre-wrap">{setting}</pre>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setIsCreating(true)}>编辑设定</Button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <p className="text-muted-foreground">还没有创建设定</p>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4 mr-2" />
          开始创建
        </Button>
      </div>
    );
  };

  const getExistingSettings = (type: string): string => {
    switch (type) {
      case "character":
        return settings.world || "";
      case "plot":
        return `世界观：\n${settings.world || ""}\n\n角色：\n${
          settings.character || ""
        }`;
      case "magic-system":
        return settings.world || "";
      default:
        return "";
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">故事设定</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="world">世界观</TabsTrigger>
          <TabsTrigger value="character">角色</TabsTrigger>
          <TabsTrigger value="plot">剧情</TabsTrigger>
          <TabsTrigger value="magic-system">魔法体系</TabsTrigger>
        </TabsList>

        <TabsContent value="world">
          {renderSettingContent("world", settings.world)}
        </TabsContent>

        <TabsContent value="character">
          {renderSettingContent("character", settings.character)}
        </TabsContent>

        <TabsContent value="plot">
          {renderSettingContent("plot", settings.plot)}
        </TabsContent>

        <TabsContent value="magic-system">
          {renderSettingContent("magic-system", settings.magicSystem)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
