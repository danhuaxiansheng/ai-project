import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { StoryProvider } from "@/contexts/story-context";
import { Toaster } from "@/components/ui/toaster";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "Tale Weaver - AI 小说创作助手",
  description: "AI驱动的小说创作助手，帮助您创作精彩故事",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${geist.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <StoryProvider>{children}</StoryProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
