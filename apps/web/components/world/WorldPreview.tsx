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
  onUpdated?: (data: WorldData) => void;
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

export function WorldPreview({ data, onUpdated }: WorldPreviewProps) {
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
          setIsEditing(false);
          onUpdated?.(updatedData);
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
                    {data.data.civilization.technology.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {data.data.civilization.technology.description}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">社会结构</h4>
                  <p className="text-lg">
                    {data.data.civilization.society.name}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">主要产业</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.data.civilization.economy.industries.map(
                      (industry) => (
                        <Badge
                          key={industry.id}
                          variant="secondary"
                          className="text-sm"
                        >
                          {industry.name}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">发展水平</h4>
                  <p className="text-lg">
                    Level {data.data.civilization.society.development_level}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    人口规模：
                    {data.data.civilization.society.population.toLocaleString()}
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
                        {data.data.civilization.culture.values_name}
                      </p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">信仰</p>
                      <p className="font-medium">
                        {data.data.civilization.culture.beliefs_name}
                      </p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">习俗</p>
                      <p className="font-medium">
                        {data.data.civilization.culture.customs_name}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-span-1 md:col-span-2">
                  <p className="text-muted-foreground">
                    {data.data.civilization.description}
                  </p>
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
              <div className="space-y-6">
                {/* 时代列表 */}
                <div className="space-y-4">
                  <h3 className="font-semibold">历史时期</h3>
                  {data.data.history.eras.map((era, index) => (
                    <div key={index} className="p-4 bg-muted rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{era.name}</h4>
                        <span className="text-sm text-muted-foreground">
                          {era.start_year} 至 {era.end_year}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {era.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* 重要事件 */}
                <div className="space-y-4">
                  <h3 className="font-semibold">重要事件</h3>
                  {data.data.history.events.map((event, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="min-w-[100px] text-right">
                        <span className="font-medium">年份 {event.year}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{event.type_name}</Badge>
                          <span className="text-sm text-muted-foreground">
                            重要性: {event.significance}
                          </span>
                        </div>
                        <p className="mt-1">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 时间线摘要 */}
                <div className="space-y-4">
                  <h3 className="font-semibold">时间线摘要</h3>
                  <div className="space-y-2">
                    {data.data.history.timeline.map((event, index) => (
                      <p key={index} className="text-sm">
                        {event}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
