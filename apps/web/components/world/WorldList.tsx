import { useState, useEffect } from "react";
import { WorldSummary, worldApi } from "@/lib/api/world";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, parseISO, isValid } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Loader2 } from "lucide-react";

interface WorldListProps {
  projectName?: string;
  onSelect: (worldId: string) => void;
}

export function WorldList({
  projectName = "default_project",
  onSelect,
}: WorldListProps) {
  const [worlds, setWorlds] = useState<Record<string, WorldSummary>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWorlds();
  }, [projectName]);

  const loadWorlds = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await worldApi.listWorlds(projectName);
      setWorlds(data);
    } catch (error) {
      console.error("Failed to load worlds:", error);
      setError("加载世界列表失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return "未知时间";

      const date = parseISO(dateString);
      if (!isValid(date)) return "未知时间";

      return format(date, "yyyy-MM-dd HH:mm", {
        locale: zhCN,
      });
    } catch (error) {
      console.error("Invalid date:", dateString);
      return "未知时间";
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-32 space-y-4">
        <p className="text-destructive">{error}</p>
        <Button variant="outline" onClick={loadWorlds}>
          重试
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-32 space-y-4">
        <Loader2 className="w-6 h-6 animate-spin" />
        <p className="text-sm text-muted-foreground">加载世界列表中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">已有世界</h2>
        <Button variant="outline" onClick={loadWorlds}>
          刷新列表
        </Button>
      </div>

      {Object.entries(worlds).length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>还没有创建任何世界</p>
          <p className="text-sm mt-2">点击"创建新世界"开始你的世界创造之旅</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(worlds).map(([id, world]) => (
            <Card
              key={id}
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => onSelect(id)}
            >
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{world.name || `世界-${id}`}</span>
                  <Badge variant="outline">{world.seed}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {world.description || "暂无描述"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {world.tags?.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    创建于 {formatDate(world.created_at)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
