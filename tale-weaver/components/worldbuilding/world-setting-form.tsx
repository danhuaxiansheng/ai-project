"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Wand2, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { AIService } from "@/services/ai";
import { AI_ROLES } from "@/config/ai";

interface Region {
  id: string;
  name: string;
  description: string;
  climate: string;
  terrain: string;
}

interface WorldSettingFormProps {
  storyId: string;
  onSave: () => void;
}

export function WorldSettingForm({ storyId, onSave }: WorldSettingFormProps) {
  const [activeTab, setActiveTab] = useState("geography");
  const [regions, setRegions] = useState<Region[]>([]);
  const [newRegion, setNewRegion] = useState<Region>({
    id: "",
    name: "",
    description: "",
    climate: "",
    terrain: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const aiService = AIService.getInstance();

  const getAISuggestion = async (type: string, content: string) => {
    try {
      setIsGenerating(true);
      const prompt = `请帮我完善以下${type}设定：\n\n${content}`;

      const response = await aiService.generateResponse(
        AI_ROLES.STORY_BUILDER,
        [
          {
            role: "user",
            content: prompt,
          },
        ]
      );

      if (response?.content) {
        return response.content;
      }
    } catch (error) {
      toast({
        title: "生成失败",
        description: "获取AI建议时出错",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddRegion = () => {
    if (newRegion.name && newRegion.description) {
      setRegions([...regions, { ...newRegion, id: crypto.randomUUID() }]);
      setNewRegion({
        id: "",
        name: "",
        description: "",
        climate: "",
        terrain: "",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="geography">地理</TabsTrigger>
          <TabsTrigger value="society">社会</TabsTrigger>
          <TabsTrigger value="magic">力量体系</TabsTrigger>
        </TabsList>

        <TabsContent value="geography">
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">地区设定</h3>

            <div className="space-y-4">
              {regions.map((region) => (
                <Card key={region.id} className="p-4">
                  <h4 className="font-medium">{region.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {region.description}
                  </p>
                  <div className="flex gap-2 mt-2 text-sm">
                    <span>气候: {region.climate}</span>
                    <span>地形: {region.terrain}</span>
                  </div>
                </Card>
              ))}

              <div className="space-y-4 border-t pt-4">
                <Input
                  placeholder="地区名称"
                  value={newRegion.name}
                  onChange={(e) =>
                    setNewRegion({ ...newRegion, name: e.target.value })
                  }
                />
                <Textarea
                  placeholder="地区描述"
                  value={newRegion.description}
                  onChange={(e) =>
                    setNewRegion({ ...newRegion, description: e.target.value })
                  }
                />
                <div className="flex gap-2">
                  <Input
                    placeholder="气候特征"
                    value={newRegion.climate}
                    onChange={(e) =>
                      setNewRegion({ ...newRegion, climate: e.target.value })
                    }
                  />
                  <Input
                    placeholder="地形特征"
                    value={newRegion.terrain}
                    onChange={(e) =>
                      setNewRegion({ ...newRegion, terrain: e.target.value })
                    }
                  />
                </div>
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={async () => {
                      const suggestion = await getAISuggestion(
                        "地区",
                        newRegion.description
                      );
                      if (suggestion) {
                        setNewRegion({
                          ...newRegion,
                          description: suggestion,
                        });
                      }
                    }}
                    disabled={isGenerating || !newRegion.description}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        生成中...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4 mr-2" />
                        获取AI建议
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleAddRegion}
                    disabled={!newRegion.name || !newRegion.description}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    添加地区
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* 其他标签页内容类似 */}
      </Tabs>
    </div>
  );
}
