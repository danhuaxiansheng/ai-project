"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorldSettingForm } from "./world-setting-form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { database } from "@/services/db";

interface WorldBuilderProps {
  storyId: string;
}

export function WorldBuilder({ storyId }: WorldBuilderProps) {
  const [activeTab, setActiveTab] = useState("geography");
  const { toast } = useToast();

  const handleSave = async (type: string, content: any) => {
    try {
      await database.updateSettings(storyId, type, JSON.stringify(content));
      toast({
        title: "保存成功",
        description: "世界观设定已更新",
      });
    } catch (error) {
      toast({
        title: "保存失败",
        description: "无法保存设定",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">世界观构建</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="geography">地理</TabsTrigger>
          <TabsTrigger value="society">社会</TabsTrigger>
          <TabsTrigger value="magic">力量体系</TabsTrigger>
        </TabsList>

        <TabsContent value="geography">
          <WorldSettingForm
            storyId={storyId}
            type="geography"
            onSave={(content) => handleSave("geography", content)}
          />
        </TabsContent>

        <TabsContent value="society">
          <WorldSettingForm
            storyId={storyId}
            type="society"
            onSave={(content) => handleSave("society", content)}
          />
        </TabsContent>

        <TabsContent value="magic">
          <WorldSettingForm
            storyId={storyId}
            type="magic"
            onSave={(content) => handleSave("magic", content)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
