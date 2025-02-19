"use client";

import { MainNav } from "@/components/main-nav";
import { StorySelector } from "@/components/story-selector";
import { RoleSelector } from "@/components/role-selector";
import { StoryEditor } from "@/components/story-editor";
import { StoryToolbar } from "@/components/story-toolbar";
import { WorldBuilder } from "@/components/worldbuilding/world-builder";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStory } from "@/contexts/story-context";

export default function Home() {
  const { currentStory } = useStory();

  return (
    <div className="min-h-screen flex flex-col bg-muted/10">
      <MainNav />
      <main className="flex-1 container mx-auto py-6 px-4">
        <div className="grid grid-cols-[280px_1fr] gap-6">
          {/* 左侧边栏 */}
          <aside className="space-y-4">
            <div className="p-6 border rounded-xl bg-card shadow-sm">
              <StorySelector />
            </div>
            {currentStory && (
              <div className="p-6 border rounded-xl bg-card shadow-sm">
                <RoleSelector />
              </div>
            )}
          </aside>

          {/* 主要内容区 */}
          <div className="space-y-4">
            {currentStory ? (
              <>
                <div className="p-6 border rounded-xl bg-card shadow-sm">
                  <StoryToolbar />
                </div>
                <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
                  <Tabs defaultValue="editor">
                    <div className="px-6 pt-6">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="editor">故事创作</TabsTrigger>
                        <TabsTrigger value="worldbuilding">
                          世界观构建
                        </TabsTrigger>
                      </TabsList>
                    </div>
                    <TabsContent value="editor" className="m-0">
                      <StoryEditor />
                    </TabsContent>
                    <TabsContent value="worldbuilding" className="m-0 p-6">
                      <WorldBuilder />
                    </TabsContent>
                  </Tabs>
                </div>
              </>
            ) : (
              <div className="flex h-[600px] items-center justify-center text-muted-foreground">
                请先选择或创建一个故事
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
