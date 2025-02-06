"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui";
import ChatContainer from "@/components/chat/ChatContainer";
import NovelEditor from "@/components/editor/NovelEditor";
import RolePanel from "@/components/role/RolePanel";

export default function Home() {
  const [activeTab, setActiveTab] = useState("chat");

  return (
    <div className="container mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">AI 小说创作系统</h1>
        <p className="text-gray-600">多角色协作的智能创作平台</p>
      </header>

      <main className="min-h-[80vh] border rounded-lg shadow-sm">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b px-4">
            <TabsList>
              <TabsTrigger value="chat">角色对话</TabsTrigger>
              <TabsTrigger value="editor">小说编辑</TabsTrigger>
              <TabsTrigger value="roles">角色管理</TabsTrigger>
            </TabsList>
          </div>

          <div className="h-[calc(80vh-4rem)]">
            <TabsContent value="chat" className="h-full">
              <ChatContainer />
            </TabsContent>

            <TabsContent value="editor" className="h-full">
              <NovelEditor />
            </TabsContent>

            <TabsContent value="roles" className="h-full">
              <RolePanel />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
}
