import { ModeToggle } from "@/components/mode-toggle";

export function MainNav() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-6 flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold">Tale Weaver</h1>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
