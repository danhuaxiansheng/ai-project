import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI小说创作中控系统",
  description: "实时监控和干预AI角色的创作过程",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
