"use client";

import { WorldData } from "@/lib/api/world";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { saveAs } from "file-saver";
import { format } from "date-fns";
import JSZip from "jszip";
import { useState } from "react";
import { WorldEditor } from "./WorldEditor";

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
  const [isEditing, setIsEditing] = useState(false);

  const handleDownload = () => {
    // 准备要保存的数据
    const worldData = {
      ...data,
      exportedAt: new Date().toISOString(),
    };

    // 按不同类型保存文件
    const files = [
      {
        name: `世界观/${data.id}/基础信息.json`,
        content: JSON.stringify(
          {
            id: data.id,
            seed: data.seed,
            version: data.version,
            timestamp: data.timestamp,
          },
          null,
          2
        ),
      },
      {
        name: `世界观/${data.id}/地理环境.json`,
        content: JSON.stringify(data.data.geography, null, 2),
      },
      {
        name: `世界观/${data.id}/文明发展.json`,
        content: JSON.stringify(data.data.civilization, null, 2),
      },
      {
        name: `世界观/${data.id}/历史事件.json`,
        content: JSON.stringify(data.data.history, null, 2),
      },
      {
        name: `世界观/${data.id}/完整数据.json`,
        content: JSON.stringify(worldData, null, 2),
      },
    ];

    // 创建 ZIP 文件
    const zip = new JSZip();
    files.forEach(({ name, content }) => {
      zip.file(name, content);
    });

    // 生成并下载 ZIP 文件
    zip.generateAsync({ type: "blob" }).then((content) => {
      const fileName = `世界观-${data.id}-${format(
        new Date(),
        "yyyyMMdd-HHmmss"
      )}.zip`;
      saveAs(content, fileName);
    });
  };

  if (isEditing) {
    return (
      <WorldEditor
        data={data}
        onSaved={(updatedData) => {
          // 更新数据并退出编辑模式
          setIsEditing(false);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">世界预览</h2>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            编辑世界
          </Button>
          <Button
            variant="outline"
            onClick={handleDownload}
            title="导出为ZIP文件，包含所有世界设定"
          >
            <Download className="w-4 h-4 mr-2" />
            导出设定
          </Button>
          <Button variant="outline" title="分享世界种子">
            <Share2 className="w-4 h-4 mr-2" />
            分享种子
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="font-semibold">技术水平</h4>
                  <p className="text-lg">
                    {TECH_LEVEL_MAP[data.data.civilization.technology_level] ||
                      data.data.civilization.technology_level}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">社会结构</h4>
                  <p className="text-lg">
                    {SOCIAL_STRUCTURE_MAP[
                      data.data.civilization.social_structure
                    ] || data.data.civilization.social_structure}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">主要产业</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.data.civilization.major_industries.map((industry) => (
                      <Badge
                        key={industry}
                        variant="secondary"
                        className="text-sm"
                      >
                        {INDUSTRY_MAP[industry] || industry}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">发展水平</h4>
                  <p className="text-lg">
                    Level {data.data.civilization.development_level}
                  </p>
                </div>
                <div className="col-span-1 md:col-span-2 space-y-4">
                  <h4 className="font-semibold">文化特征</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">
                        价值观
                      </p>
                      <p className="font-medium">
                        {data.data.civilization.cultural_traits.values}
                      </p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">信仰</p>
                      <p className="font-medium">
                        {data.data.civilization.cultural_traits.beliefs}
                      </p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">习俗</p>
                      <p className="font-medium">
                        {data.data.civilization.cultural_traits.customs}
                      </p>
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
