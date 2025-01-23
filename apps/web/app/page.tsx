"use client";

import { useState } from "react";
import { WorldGeneratorForm } from "@/components/world/WorldGeneratorForm";
import { WorldPreview } from "@/components/world/WorldPreview";
import { WorldList } from "@/components/world/WorldList";
import { WorldData, worldApi } from "@/lib/api/world";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  const [worldData, setWorldData] = useState<WorldData | null>(null);
  const [activeTab, setActiveTab] = useState("list");

  // 保存表单状态
  const [formState, setFormState] = useState({
    prompt: "",
    seed: "",
    complexity: 5,
    focusAreas: [] as string[],
  });

  const handleWorldSelect = async (worldId: string) => {
    try {
      const data = await worldApi.getWorld("default_project", worldId);
      setWorldData(data);
      setActiveTab("preview");
    } catch (error) {
      console.error("Failed to load world:", error);
    }
  };

  const handleWorldGenerated = (data: WorldData) => {
    setWorldData(data);
    setActiveTab("preview");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">虚拟世界生成器</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">已有世界</TabsTrigger>
          <TabsTrigger value="create">创建新世界</TabsTrigger>
          <TabsTrigger value="preview" disabled={!worldData}>
            世界预览
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <WorldList onSelect={handleWorldSelect} />
        </TabsContent>

        <TabsContent value="create" className="mt-6">
          <WorldGeneratorForm
            onGenerated={handleWorldGenerated}
            initialState={formState}
            onStateChange={setFormState}
          />
        </TabsContent>

        <TabsContent value="preview" className="mt-6">
          {worldData && (
            <WorldPreview
              data={worldData}
              onUpdated={(updatedData) => {
                setWorldData(updatedData);
              }}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
