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
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          {currentStory.title}
        </h2>
        <p className="text-sm text-muted-foreground">
          创建于 {new Date(currentStory.createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <QualityReview />
        <ExportDialog />
        <SettingsPanel />
      </div>
    </div>
  );
}
