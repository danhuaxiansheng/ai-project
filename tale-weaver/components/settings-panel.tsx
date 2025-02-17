"use client";

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Settings2 } from "lucide-react";
import { useStory } from "@/contexts/story-context";
import { storyDB } from "@/lib/db";
import { useToast } from "@/hooks/use-toast";

export function SettingsPanel() {
  const { state } = useStory();
  const { toast } = useToast();
  const [settings, setSettings] = React.useState<StoryMessage[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const loadSettings = React.useCallback(async () => {
    if (!state.currentStory) return;

    setIsLoading(true);
    try {
      const data = await storyDB.getStorySettings(state.currentStory.id);
      setSettings(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "加载设定失败",
      });
    } finally {
      setIsLoading(false);
    }
  }, [state.currentStory, toast]);

  const handleSearch = async () => {
    if (!state.currentStory || !searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const results = await storyDB.searchSettings(
        state.currentStory.id,
        searchQuery
      );
      setSettings(results);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "搜索设定失败",
      });
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <Settings2 className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>故事设定</SheetTitle>
          <SheetDescription>查看和管理当前故事的所有设定</SheetDescription>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="搜索设定..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleSearch}
              disabled={isLoading}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {settings.map((setting) => (
              <div
                key={setting.id}
                className="rounded-lg border p-3 text-sm space-y-1"
              >
                <div className="font-medium">
                  {setting.metadata?.type || "设定"}
                </div>
                <div className="text-muted-foreground">{setting.content}</div>
                {setting.metadata?.tags && (
                  <div className="flex gap-1 text-xs">
                    {setting.metadata.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-muted px-2 py-0.5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
