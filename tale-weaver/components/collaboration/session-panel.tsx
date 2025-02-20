import { useState, useEffect } from "react";
import { CollaborationSession, SessionService } from "@/services/session";
import { Role } from "@/types/role";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { AI_ROLES } from "@/config/ai";
import { SuggestionPanel } from "./suggestion-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SessionPanelProps {
  storyId: string;
  initialSession?: CollaborationSession;
}

export function SessionPanel({ storyId, initialSession }: SessionPanelProps) {
  const [session, setSession] = useState<CollaborationSession | null>(
    initialSession || null
  );
  const [input, setInput] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const sessionService = SessionService.getInstance();

  useEffect(() => {
    if (!session && storyId) {
      createNewSession();
    }
  }, [storyId]);

  const createNewSession = async () => {
    const roles = [
      AI_ROLES.STORY_BUILDER,
      AI_ROLES.DIALOGUE_MASTER,
      AI_ROLES.PLOT_ADVISOR,
    ];
    const newSession = await sessionService.createSession(
      storyId,
      "新协作会话",
      roles
    );
    setSession(newSession);
  };

  const sendMessage = async () => {
    if (!session || !input.trim() || !selectedRole) return;

    // 添加用户消息
    await sessionService.addMessage(session.id, input, "user");
    setInput("");

    // 生成 AI 响应
    await sessionService.generateAIResponse(session.id, selectedRole.id);

    // 刷新会话
    const updatedSession = await sessionService.getSession(session.id);
    setSession(updatedSession);
  };

  const acceptSuggestion = async (messageId: string) => {
    if (!session) return;
    await sessionService.acceptSuggestion(session.id, messageId);
    const updatedSession = await sessionService.getSession(session.id);
    setSession(updatedSession);
  };

  const rejectSuggestion = async (messageId: string) => {
    if (!session) return;
    // 标记建议为已拒绝
    await sessionService.rejectSuggestion(session.id, messageId);
    const updatedSession = await sessionService.getSession(session.id);
    setSession(updatedSession);
  };

  if (!session) return null;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">{session.title}</h2>
        <div className="flex gap-2">
          {session.participants.map((participant) => (
            <Button
              key={participant.role.id}
              variant={
                selectedRole?.id === participant.role.id ? "default" : "outline"
              }
              onClick={() => setSelectedRole(participant.role)}
            >
              {participant.role.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex">
        <Tabs defaultValue="chat" className="flex-1 flex flex-col">
          <TabsList className="mx-4 mt-2">
            <TabsTrigger value="chat">对话</TabsTrigger>
            <TabsTrigger value="suggestions">建议</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="flex-1">
            <ScrollArea className="h-full">
              <div className="space-y-4 p-4">
                {session.participants.flatMap((participant) =>
                  participant.messages.map((message) => (
                    <Card key={message.id} className="p-4">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                            {message.role === "user"
                              ? "用"
                              : participant.role.name[0]}
                          </div>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium">
                            {message.role === "user"
                              ? "用户"
                              : participant.role.name}
                          </div>
                          <div className="mt-1 text-sm">{message.content}</div>
                          {message.metadata?.suggestion &&
                            !message.metadata?.accepted && (
                              <div className="flex gap-2 mt-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => acceptSuggestion(message.id)}
                                >
                                  采纳建议
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => rejectSuggestion(message.id)}
                                >
                                  忽略建议
                                </Button>
                              </div>
                            )}
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="suggestions" className="flex-1">
            <SuggestionPanel
              session={session}
              onAcceptSuggestion={acceptSuggestion}
              onRejectSuggestion={rejectSuggestion}
            />
          </TabsContent>
        </Tabs>
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              selectedRole
                ? `与${selectedRole.name}对话...`
                : "请选择一个角色..."
            }
            disabled={!selectedRole}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <Button
            onClick={sendMessage}
            disabled={!selectedRole || !input.trim()}
          >
            发送
          </Button>
        </div>
      </div>
    </div>
  );
}
