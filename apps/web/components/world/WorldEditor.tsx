import { useState } from "react";
import { WorldData, worldApi } from "@/lib/api/world";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WorldEditorProps {
  data: WorldData;
  onSaved: (data: WorldData) => void;
}

export function WorldEditor({ data: initialData, onSaved }: WorldEditorProps) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (updates: Partial<WorldData>) => {
    setLoading(true);
    try {
      await worldApi.updateWorld(
        data.project || "default_project",
        data.id,
        updates
      );
      const updatedData = await worldApi.getWorld(
        data.project || "default_project",
        data.id
      );
      setData(updatedData);
      onSaved(updatedData);
      toast({
        title: "成功",
        description: "世界设定已更新",
      });
    } catch (error) {
      toast({
        title: "错误",
        description: "更新失败，请重试",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">编辑世界</h2>
        <Button onClick={() => handleUpdate(data)} disabled={loading}>
          {loading ? "保存中..." : "保存更改"}
        </Button>
      </div>

      <Tabs defaultValue="geography">
        <TabsList>
          <TabsTrigger value="geography">地理环境</TabsTrigger>
          <TabsTrigger value="civilization">文明发展</TabsTrigger>
          <TabsTrigger value="history">历史事件</TabsTrigger>
        </TabsList>

        {/* 添加各个标签页的编辑表单 */}
        <TabsContent value="geography">
          <Card>
            <CardHeader>
              <CardTitle>地理环境</CardTitle>
            </CardHeader>
            <CardContent>{/* 添加地理相关的编辑表单 */}</CardContent>
          </Card>
        </TabsContent>

        {/* 添加其他标签页... */}
      </Tabs>
    </div>
  );
}
