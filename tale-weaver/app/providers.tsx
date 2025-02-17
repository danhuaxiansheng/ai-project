"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { StoryProvider } from "@/contexts/story-context";
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";
import { syncManager } from "@/lib/sync-manager";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    syncManager.start();
    return () => syncManager.destroy();
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
