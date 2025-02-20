"use client";

import { useState } from "react";
import { SessionList } from "@/components/collaboration/session-list";
import { SessionPanel } from "@/components/collaboration/session-panel";
import { CollaborationSession } from "@/services/session";
import { AI_ROLES } from "@/config/ai";

interface CollaborationPageProps {
  params: {
    id: string;
  };
}

export default function CollaborationPage({ params }: CollaborationPageProps) {
  const [selectedSession, setSelectedSession] =
    useState<CollaborationSession | null>(null);

  return (
    <div className="flex h-screen">
      <SessionList storyId={params.id} onSelectSession={setSelectedSession} />
      {selectedSession ? (
        <div className="flex-1">
          <SessionPanel storyId={params.id} initialSession={selectedSession} />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          选择或创建一个协作会话开始写作
        </div>
      )}
    </div>
  );
}
