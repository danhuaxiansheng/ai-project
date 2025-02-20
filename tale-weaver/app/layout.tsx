import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/user-nav";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StoryProvider } from "@/contexts/story-context";
import { ErrorBoundary } from "@/components/error-boundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tale Weaver - AI 小说创作助手",
  description: "一个智能写作助手应用，帮助创作者更好地创作和管理他们的故事",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={cn(inter.className, "min-h-screen bg-background")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ErrorBoundary>
            <StoryProvider>
              {/* 顶部导航栏 */}
              <header className="border-b">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <h1 className="text-xl font-bold">Tale Weaver</h1>
                    <nav className="hidden md:flex gap-6">
                      <a href="/" className="text-sm font-medium hover:text-primary">故事列表</a>
                      <a href="/templates" className="text-sm font-medium text-muted-foreground hover:text-primary">模板库</a>
                      <a href="/tutorials" className="text-sm font-medium text-muted-foreground hover:text-primary">教程</a>
                    </nav>
                  </div>
                  <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <UserNav />
                  </div>
                </div>
              </header>

              <main className="min-h-[calc(100vh-4rem)]">{children}</main>
              
              <footer className="border-t py-6 md:py-0">
                <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
                  <p className="text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} Tale Weaver. All rights reserved.
                  </p>
                  <nav className="flex gap-4">
                    <a href="/about" className="text-sm text-muted-foreground hover:text-primary">关于</a>
                    <a href="/privacy" className="text-sm text-muted-foreground hover:text-primary">隐私政策</a>
                    <a href="/terms" className="text-sm text-muted-foreground hover:text-primary">使用条款</a>
                  </nav>
                </div>
              </footer>
              
              <Toaster />
            </StoryProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
