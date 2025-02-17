import { ModeToggle } from "@/components/mode-toggle";
import { ExportDialog } from "@/components/export-dialog";
import { QualityReview } from "@/components/quality-review";
import { StorySelector } from "@/components/story-selector";
import { SettingsPanel } from "@/components/settings-panel";

export function MainNav() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-6 flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold">Tale Weaver</h1>
          <StorySelector />
        </div>
        <div className="flex items-center gap-4">
          <SettingsPanel />
          <QualityReview />
          <ExportDialog />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
