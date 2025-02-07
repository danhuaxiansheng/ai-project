"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface NovelEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  className?: string;
  placeholder?: string;
}

export function NovelEditor({
  content = "",
  onChange,
  className,
  placeholder = "开始创作你的小说...",
}: NovelEditorProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
        emptyEditorClass:
          "before:content-[attr(data-placeholder)] before:text-muted-foreground before:float-left before:pointer-events-none",
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[200px]",
          "prose-p:my-2 prose-headings:mb-3 prose-headings:mt-6",
          "prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg"
        ),
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  if (!isMounted) {
    return (
      <div
        className={cn(
          "rounded-md border bg-background p-4 overflow-y-auto animate-pulse",
          className
        )}
      >
        <div className="h-[200px] bg-muted rounded-md" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-md border bg-background p-4 overflow-y-auto",
        className
      )}
    >
      <EditorContent editor={editor} />
    </div>
  );
}
