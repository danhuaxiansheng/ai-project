"use client";

import { useState, useEffect } from "react";
import { WorldGeneratorForm } from "@/components/world/WorldGeneratorForm";
import { WorldPreview } from "@/components/world/WorldPreview";
import { WorldList } from "@/components/world/WorldList";
import { worldApi } from "@/lib/api/world";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { World } from "@/lib/types";

export default function Home() {
  const [worlds, setWorlds] = useState<World[]>([]);
  const [selectedWorld, setSelectedWorld] = useState<World | null>(null);
  const [activeTab, setActiveTab] = useState("list");
  const [loading, setLoading] = useState(true);

  // 保存表单状态
  const [formState, setFormState] = useState({
    prompt: "",
    seed: "",
    complexity: 5,
    focusAreas: [] as string[],
  });

  // 加载世界列表
  const loadWorlds = async () => {
    try {
      setLoading(true);
      const response = await worldApi.listWorlds("default_project");
      setWorlds(response.worlds || []);
    } catch (error) {
      console.error("Failed to load worlds:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorlds();
  }, []);

  const handleWorldSelect = async (world: World) => {
    try {
      const data = await worldApi.getWorld("default_project", world.id);
      setSelectedWorld(data);
      setActiveTab("preview");
    } catch (error) {
      console.error("Failed to load world:", error);
    }
  };

  const handleWorldGenerated = (world: World) => {
    setSelectedWorld(world);
    setWorlds((prev) => [world, ...prev]); // 将新世界添加到列表开头
    setActiveTab("preview");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">虚拟世界生成器</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">已有世界</TabsTrigger>
          <TabsTrigger value="create">创建新世界</TabsTrigger>
          <TabsTrigger value="preview" disabled={!selectedWorld}>
            世界预览
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <WorldList worlds={worlds} onWorldSelect={handleWorldSelect} />
        </TabsContent>

        <TabsContent value="create" className="mt-6">
          <WorldGeneratorForm
            onGenerated={handleWorldGenerated}
            initialState={formState}
            onStateChange={setFormState}
          />
        </TabsContent>

        <TabsContent value="preview" className="mt-6">
          {selectedWorld && (
            <WorldPreview
              world={selectedWorld}
              onClick={() => {}} // 可选的点击处理
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
