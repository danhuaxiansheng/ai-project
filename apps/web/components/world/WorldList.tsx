import { useState, useEffect } from "react";
import { WorldSummary, worldApi } from "@/lib/api/world";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
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

  useEffect(() => {
    loadWorlds();
  }, [projectName]);

  const loadWorlds = async () => {
    try {
      const data = await worldApi.listWorlds(projectName);
      setWorlds(data);
    } catch (error) {
      console.error("Failed to load worlds:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "yyyy-MM-dd HH:mm", {
        locale: zhCN,
      });
    } catch (error) {
      console.error("Invalid date:", dateString);
      return "未知时间";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader2 className="w-6 h-6 animate-spin" />
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
    </div>
  );
}
