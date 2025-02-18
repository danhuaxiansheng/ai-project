"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { StoryProvider } from "@/contexts/story-context";
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";
import { syncManager } from "@/lib/sync-manager";
import { handleDatabaseError } from "@/lib/db-recovery";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    syncManager.start();
    return () => syncManager.destroy();
  }, []);

  useEffect(() => {
    // 监听未捕获的错误
    const handleError = (event: ErrorEvent) => {
      if (event.error?.name === "NotFoundError") {
        handleDatabaseError(event.error);
      }
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
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
