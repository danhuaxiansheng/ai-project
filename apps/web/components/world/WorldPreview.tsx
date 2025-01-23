"use client";

import { WorldData } from "@/lib/api/world";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface WorldPreviewProps {
  data: WorldData;
}

const TECH_LEVEL_MAP: Record<string, string> = {
  primitive: "原始",
  medieval: "中世纪",
  renaissance: "文艺复兴",
  industrial: "工业化",
  modern: "现代",
  futuristic: "未来",
  magical: "魔法",
};

const SOCIAL_STRUCTURE_MAP: Record<string, string> = {
  tribal: "部落制",
  feudal: "封建制",
  monarchy: "君主制",
  republic: "共和制",
  democracy: "民主制",
  technocracy: "技术官僚制",
  theocracy: "神权制",
};

const INDUSTRY_MAP: Record<string, string> = {
  agriculture: "农业",
  commerce: "商业",
  crafting: "手工业",
  mining: "采矿业",
  magic: "魔法产业",
  technology: "科技产业",
  education: "教育产业",
};

export function WorldPreview({ data }: WorldPreviewProps) {
  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `world-${data.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">世界预览</h2>
        <div className="space-x-2">
          <Button variant="outline" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            下载
          </Button>
          <Button variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            分享
          </Button>
        </div>
      </div>

      <Tabs defaultValue="geography">
        <TabsList>
          <TabsTrigger value="geography">地理</TabsTrigger>
          <TabsTrigger value="civilization">文明</TabsTrigger>
          <TabsTrigger value="history">历史</TabsTrigger>
        </TabsList>

        <TabsContent value="geography">
          <Card>
            <CardHeader>
              <CardTitle>地理环境</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">地形</h4>
                  <p>{data.data.geography.terrain}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">气候</h4>
                  <p>{data.data.geography.climate}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="civilization">
          <Card>
            <CardHeader>
              <CardTitle>文明发展</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">技术水平</h4>
                  <p>
                    {TECH_LEVEL_MAP[data.data.civilization.technology_level] ||
                      data.data.civilization.technology_level}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">社会结构</h4>
                  <p>
                    {SOCIAL_STRUCTURE_MAP[
                      data.data.civilization.social_structure
                    ] || data.data.civilization.social_structure}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">主要产业</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.data.civilization.major_industries.map((industry) => (
                      <Badge key={industry} variant="secondary">
                        {INDUSTRY_MAP[industry] || industry}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">发展水平</h4>
                  <p>Level {data.data.civilization.development_level}</p>
                </div>
                <div className="col-span-2">
                  <h4 className="font-semibold mb-2">文化特征</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">价值观</p>
                      <p>{data.data.civilization.cultural_traits.values}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">信仰</p>
                      <p>{data.data.civilization.cultural_traits.beliefs}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">习俗</p>
                      <p>{data.data.civilization.cultural_traits.customs}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>历史事件</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.data.history.map((event, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <span className="font-semibold">年份 {event.year}</span>
                    <span>{event.event}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
