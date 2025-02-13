import { Sidebar } from "@/components/sidebar";
import { ChatContainer } from "@/components/chat-container";
import { EditorContainer } from "@/components/editor-container";

export default function Home() {
  return (
    <div className="flex h-screen bg-background">
      {/* 左侧边栏 - 角色选择和项目信息 */}
      <Sidebar className="w-64 border-r" />

      {/* 中间聊天区域 */}
      <ChatContainer className="flex-1 border-r" />

      {/* 右侧编辑器区域 */}
      <EditorContainer className="w-1/3" />
    </div>
  );
}
