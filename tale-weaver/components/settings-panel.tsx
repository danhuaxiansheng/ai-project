"use client";

import { useState, useEffect } from "react";
import { useStory } from "@/contexts/story-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { database } from "@/services/db";
import { Loader2 } from "lucide-react";

export function SettingsPanel() {
  const { currentStory } = useStory();
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [settings, setSettings] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function loadSettings() {
      if (!currentStory) return;

      try {
        setIsLoading(true);
        const settings = await database.getNovelSettings(currentStory.id);
        setSettings(settings);
      } catch (error) {
        console.error("Failed to load settings:", error);
        toast({
          title: "错误",
          description: "加载设置失败",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadSettings();
  }, [currentStory, toast]);

  const handleSearch = async () => {
    if (!currentStory || !searchQuery.trim()) return;

    try {
      setIsLoading(true);
      const results = await database.searchSettingsByTag(searchQuery);
      // 处理搜索结果
      console.log("Search results:", results);
    } catch (error) {
      console.error("Search failed:", error);
      toast({
        title: "错误",
        description: "搜索失败",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!currentStory || !settings) return;

    try {
      setIsLoading(true);
      await database.updateNovelSettings(currentStory.id, settings);
      toast({
        title: "成功",
        description: "设置已保存",
      });
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast({
        title: "错误",
        description: "保存设置失败",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentStory) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        请先选择或创建一个故事
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="搜索设置..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button variant="outline" onClick={handleSearch} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "搜索"}
        </Button>
      </div>

      {settings && (
        <div className="space-y-4">
          {/* 设置表单内容 */}
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "保存设置"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
