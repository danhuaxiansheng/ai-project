"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorldGeneratorForm } from "@/components/world/WorldGeneratorForm";
import { WorldPreview } from "@/components/world/WorldPreview";
import { WorldData } from "@/lib/api/world";

export function WorldGeneratorLayout() {
  const [activeTab, setActiveTab] = useState("create");
  const [worldData, setWorldData] = useState<WorldData | null>(null);

  const handleWorldGenerated = (data: WorldData) => {
    setWorldData(data);
    setActiveTab("preview");
  };

  return (
    <Card className="p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="create">创建世界</TabsTrigger>
          <TabsTrigger value="preview" disabled={!worldData}>
            预览结果
          </TabsTrigger>
        </TabsList>
        <TabsContent value="create">
          <WorldGeneratorForm onGenerated={handleWorldGenerated} />
        </TabsContent>
        <TabsContent value="preview">
          {worldData && <WorldPreview data={worldData} />}
        </TabsContent>
      </Tabs>
    </Card>
  );
}
