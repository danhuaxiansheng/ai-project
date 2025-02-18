"use client";

import { MainNav } from "@/components/main-nav";
import { StorySelector } from "@/components/story-selector";
import { RoleSelector } from "@/components/role-selector";
import { StoryEditor } from "@/components/story-editor";
import { StoryToolbar } from "@/components/story-toolbar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <main className="flex-1 container mx-auto py-6">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
          <aside className="space-y-6">
            <div className="p-4 border rounded-lg bg-card">
              <StorySelector />
            </div>
            <div className="p-4 border rounded-lg bg-card">
              <RoleSelector />
            </div>
          </aside>
          <div className="flex flex-col gap-4">
            <div className="p-4 border rounded-lg bg-card">
              <StoryToolbar />
            </div>
            <div className="flex-1 border rounded-lg bg-card overflow-hidden">
              <StoryEditor />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
