"use client";

import { ExportDialog } from "@/components/export-dialog";
import { QualityReview } from "@/components/quality-review";
import { SettingsPanel } from "@/components/settings-panel";
import { useStory } from "@/contexts/story-context";

export function StoryToolbar() {
  const { currentStory } = useStory();

  if (!currentStory) return null;

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold">{currentStory.title}</h2>
      <div className="flex items-center gap-2">
        <QualityReview />
        <ExportDialog />
        <SettingsPanel />
      </div>
    </div>
  );
}
