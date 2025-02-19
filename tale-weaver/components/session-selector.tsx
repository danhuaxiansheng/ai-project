"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useStory } from "@/contexts/story-context";
import { storyDB } from "@/lib/db";
import { nanoid } from "nanoid";
import { useToast } from "@/hooks/use-toast";

export function SessionSelector() {
  const { state, dispatch } = useStory();
  const { toast } = useToast();
  const [sessions, setSessions] = React.useState<StorySession[]>([]);
  const [newSessionTitle, setNewSessionTitle] = React.useState("");
  const [newSessionType, setNewSessionType] = React.useState<
    "story" | "dialogue" | "plot"
  >("story");

  const loadSessions = React.useCallback(async () => {
    if (!state.currentStory) return;
    try {
      debugger;
      const data = await storyDB.getStorySessions(state.currentStory.id);
      setSessions(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "加载会话失败",
      });
    }
  }, [state.currentStory, toast]);

  React.useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const createNewSession = async () => {
    if (!state.currentStory || !newSessionTitle.trim()) return;

    try {
      const newSession: StorySession = {
        id: nanoid(),
        storyId: state.currentStory.id,
        title: newSessionTitle.trim(),
        type: newSessionType,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await storyDB.createSession(newSession);
      setNewSessionTitle("");
      loadSessions();
      dispatch({ type: "SET_SESSION", payload: newSession });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "创建会话失败",
      });
    }
  };

  const handleSessionChange = async (sessionId: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (!session) return;

    try {
      const messages = await storyDB.getSessionMessages(sessionId);
      dispatch({ type: "SET_SESSION", payload: session });
      dispatch({ type: "SET_MESSAGES", payload: messages });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "切换会话失败",
      });
    }
  };

  if (!state.currentStory) return null;

  return (
    <div className="flex items-center gap-2">
      <Select
        value={state.currentSession?.id}
        onValueChange={handleSessionChange}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="选择会话..." />
        </SelectTrigger>
        <SelectContent>
          {sessions.map((session) => (
            <SelectItem key={session.id} value={session.id}>
              {session.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新建会话</DialogTitle>
            <DialogDescription>
              创建一个新的会话来继续你的故事创作。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="会话标题"
                value={newSessionTitle}
                onChange={(e) => setNewSessionTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Select
                value={newSessionType}
                onValueChange={(value: "story" | "dialogue" | "plot") =>
                  setNewSessionType(value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择会话类型..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="story">故事情节</SelectItem>
                  <SelectItem value="dialogue">对话创作</SelectItem>
                  <SelectItem value="plot">剧情设计</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end">
              <Button onClick={createNewSession}>创建</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
