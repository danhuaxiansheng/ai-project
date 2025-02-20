import { useState, useEffect } from "react";
import {
  SettingCollaborationService,
  SettingType,
} from "@/services/setting-collaboration";
import { CollaborationSession } from "@/services/session";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { SuggestionPanel } from "@/components/collaboration/suggestion-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SettingEditorProps {
  storyId: string;
  settingType: SettingType;
  initialContent?: string;
  existingSettings?: string;
  requirements?: string;
  onSave: (content: string) => void;
}

export function SettingEditor({
  storyId,
  settingType,
  initialContent = "",
  existingSettings = "",
  requirements = "",
  onSave,
}: SettingEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [session, setSession] = useState<CollaborationSession | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const settingService = SettingCollaborationService.getInstance();

  useEffect(() => {
    if (isEditing && !session) {
      startCollaboration();
    }
  }, [isEditing]);

  const startCollaboration = async () => {
    const newSession = await settingService.startSettingSession(
      storyId,
      settingType,
      {
        type: settingType,
        currentContent: content,
        existingSettings,
        requirements,
      }
    );
    setSession(newSession);
  };

  const handleAcceptSuggestion = async (messageId: string) => {
    if (!session) return;
    const updatedSession = await settingService.acceptSuggestion(
      session.id,
      messageId
    );
    setSession(updatedSession);

    // 应用已接受的建议到内容中
    const finalContent = await settingService.applyAcceptedSuggestions(
      updatedSession
    );
    setContent(finalContent);
  };

  const handleRejectSuggestion = async (messageId: string) => {
    if (!session) return;
    const updatedSession = await settingService.rejectSuggestion(
      session.id,
      messageId
    );
    setSession(updatedSession);
  };

  const handleSave = async () => {
    await settingService.updateSetting(storyId, settingType, content);
    onSave(content);
    setIsEditing(false);
    setSession(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {settingType === "world" && "世界观设定"}
          {settingType === "character" && "角色设定"}
          {settingType === "plot" && "剧情设定"}
          {settingType === "magic-system" && "魔法体系设定"}
        </h2>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>启用 AI 协作</Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                取消
              </Button>
              <Button onClick={handleSave}>保存设定</Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="在此输入设定内容..."
            className="min-h-[400px]"
          />
        </Card>

        {isEditing && session && (
          <Card className="p-4">
            <Tabs defaultValue="suggestions" className="h-full flex flex-col">
              <TabsList>
                <TabsTrigger value="suggestions">AI 建议</TabsTrigger>
                <TabsTrigger value="preview">预览</TabsTrigger>
              </TabsList>

              <TabsContent value="suggestions" className="flex-1">
                <SuggestionPanel
                  session={session}
                  onAcceptSuggestion={handleAcceptSuggestion}
                  onRejectSuggestion={handleRejectSuggestion}
                />
              </TabsContent>

              <TabsContent value="preview" className="flex-1">
                <ScrollArea className="h-[400px]">
                  <div className="prose dark:prose-invert max-w-none">
                    {content}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </Card>
        )}
      </div>
    </div>
  );
}
