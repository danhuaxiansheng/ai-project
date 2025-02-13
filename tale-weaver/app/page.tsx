import { MainNav } from "@/components/main-nav";
import { StoryEditor } from "@/components/story-editor";
import { RoleSelector } from "@/components/role-selector";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <main className="flex-1 container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
          <aside className="hidden md:block">
            <RoleSelector />
          </aside>
          <StoryEditor />
        </div>
      </main>
    </div>
  );
}
