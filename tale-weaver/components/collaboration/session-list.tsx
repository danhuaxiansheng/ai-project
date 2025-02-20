import { useState, useEffect } from "react";
import { CollaborationSession, SessionService } from "@/services/session";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Archive, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";

interface SessionListProps {
  storyId: string;
  onSelectSession: (session: CollaborationSession) => void;
}

export function SessionList({ storyId, onSelectSession }: SessionListProps) {
  const [sessions, setSessions] = useState<CollaborationSession[]>([]);
  const sessionService = SessionService.getInstance();

  useEffect(() => {
    loadSessions();
  }, [storyId]);

  const loadSessions = async () => {
    const sessions = await sessionService.listSessions(storyId);
    setSessions(sessions);
  };

  const createNewSession = async () => {
    const roles = [
      { id: "story-builder", name: "故事构建者" },
      { id: "dialogue-master", name: "对话大师" },
      { id: "plot-advisor", name: "情节顾问" },
    ];
    const session = await sessionService.createSession(
      storyId,
      `协作会话 ${sessions.length + 1}`,
      roles
    );
    setSessions([...sessions, session]);
    onSelectSession(session);
  };

  const archiveSession = async (sessionId: string) => {
    await sessionService.updateSessionStatus(sessionId, "archived");
    await loadSessions();
  };

  return (
    <div className="w-64 border-r h-full flex flex-col">
      <div className="p-4 border-b">
        <Button onClick={createNewSession} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          新建会话
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-2 p-4">
          {sessions
            .filter((session) => session.status === "active")
            .map((session) => (
              <Card
                key={session.id}
                className="p-3 cursor-pointer hover:bg-accent"
                onClick={() => onSelectSession(session)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-sm">{session.title}</h3>
                    <p className="text-xs text-muted-foreground flex items-center mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDistanceToNow(session.updatedAt, {
                        addSuffix: true,
                        locale: zhCN,
                      })}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      archiveSession(session.id);
                    }}
                  >
                    <Archive className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex gap-1 mt-2">
                  {session.participants.map((participant) => (
                    <div
                      key={participant.role.id}
                      className="text-xs px-2 py-1 bg-secondary rounded"
                    >
                      {participant.role.name}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
        </div>
      </ScrollArea>
    </div>
  );
}
