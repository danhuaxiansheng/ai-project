"use client";

import { WorldData } from "@/lib/api/world";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";

interface WorldPreviewProps {
  data: WorldData;
}

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
                  <p>{data.data.civilization.technology_level}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">社会结构</h4>
                  <p>{data.data.civilization.social_structure}</p>
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
