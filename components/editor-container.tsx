"use client";

import { cn } from "@/lib/utils";
import { NovelEditor } from "./novel-editor";
import { Save, FileDown, Loader2, Trash } from "lucide-react";
import { useState, useEffect } from "react";
import { useRoleStore } from "@/store/role-store";
import { APIService } from "@/services/api";
import { StorageService } from "@/services/storage";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";
import { SocketService } from "@/services/socket";
import { useCollaborationStore } from "@/store/collaboration-store";
import { useSocket } from "@/hooks/use-socket";

interface EditorContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function EditorContainer({ className, ...props }: EditorContainerProps) {
  const { selectedRole } = useRoleStore();
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { updateCollaboratorStatus } = useCollaborationStore();
  const debouncedContent = useDebounce(content, 500);

  // 使用 socket hook
  useSocket(selectedRole?.id);

  // 加载缓存的内容
  useEffect(() => {
    if (selectedRole) {
      const cached = StorageService.getRoleContent(selectedRole.id);
      if (cached) {
        setContent(cached.content);
      } else {
        setContent("");
      }
    }
  }, [selectedRole]);

  // 监听其他用户的编辑
  useEffect(() => {
    if (!selectedRole) return;

    const unsubscribe = SocketService.onEdit((data) => {
      if (data.role.id !== selectedRole.id) {
        setContent(data.content);
      }
    });

    return () => {
      unsubscribe?.();
    };
  }, [selectedRole]);

  // 发送编辑更新
  useEffect(() => {
    if (!debouncedContent || !selectedRole) return;

    SocketService.sendEdit({
      role: selectedRole,
      content: debouncedContent,
      timestamp: Date.now(),
    });

    SocketService.sendCollaboration({
      roleId: selectedRole.id,
      status: "typing",
    });

    const timer = setTimeout(() => {
      SocketService.sendCollaboration({
        roleId: selectedRole.id,
        status: "joined",
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [debouncedContent, selectedRole]);

  const handleSave = async (isAutoSave = false) => {
    if (!content.trim() || !selectedRole || isSaving) return;

    setIsSaving(true);
    try {
      const success = await APIService.saveContent({
        role: selectedRole,
        content: content.trim(),
        timestamp: Date.now(),
      });

      if (success) {
        !isAutoSave && toast.success("保存成功");
      } else {
        throw new Error("保存失败");
      }
    } catch (error) {
      console.error("保存错误:", error);
      !isAutoSave && toast.error("保存失败");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearCache = () => {
    if (selectedRole) {
      const cached = StorageService.getContentFromCache();
      delete cached[selectedRole.id];
      localStorage.setItem(StorageService.CONTENT_KEY, JSON.stringify(cached));
      setContent("");
      toast.success("缓存已清除");
    }
  };

  const handleExport = () => {
    if (!content.trim()) return;
    const blob = new Blob([content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "novel.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={cn("flex flex-col", className)} {...props}>
      {/* 编辑器头部 */}
      <div className="p-4 border-b">
        <h2 className="font-semibold">内容编辑</h2>
      </div>

      {/* 编辑器主体 */}
      <div className="flex-1 overflow-hidden">
        <NovelEditor
          content={content}
          onChange={setContent}
          className="h-full"
          placeholder={
            selectedRole
              ? `以 ${selectedRole.name} 的视角开始创作...`
              : "请先选择一个角色"
          }
        />
      </div>

      {/* 工具栏 */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <button
            onClick={() => handleSave()}
            disabled={!content.trim() || isSaving}
            className={cn(
              "px-3 py-1.5 text-sm border rounded-md inline-flex items-center gap-1.5",
              "hover:bg-muted transition-colors",
              (!content.trim() || isSaving) && "opacity-50 cursor-not-allowed"
            )}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            保存
          </button>
          <button
            onClick={handleExport}
            disabled={!content.trim()}
            className={cn(
              "px-3 py-1.5 text-sm border rounded-md inline-flex items-center gap-1.5",
              "hover:bg-muted transition-colors",
              !content.trim() && "opacity-50 cursor-not-allowed"
            )}
          >
            <FileDown className="w-4 h-4" />
            导出
          </button>
          <button
            onClick={handleClearCache}
            disabled={!content.trim()}
            className={cn(
              "px-3 py-1.5 text-sm border rounded-md inline-flex items-center gap-1.5",
              "hover:bg-muted transition-colors text-destructive",
              !content.trim() && "opacity-50 cursor-not-allowed"
            )}
          >
            <Trash className="w-4 h-4" />
            清除缓存
          </button>
        </div>
      </div>
    </div>
  );
}
