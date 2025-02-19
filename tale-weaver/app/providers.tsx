"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { StoryProvider } from "@/contexts/story-context";
import { useEffect } from "react";
import { syncManager } from "@/lib/sync-manager";
import { initDatabase } from "@/lib/db";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 初始化数据库
    initDatabase()
      .then(() => syncManager.syncCache())
      .catch(console.error);
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <StoryProvider>
        {children}
        <Toaster />
      </StoryProvider>
    </ThemeProvider>
  );
}
