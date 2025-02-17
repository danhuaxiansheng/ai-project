import { supabase } from "@/lib/supabase-client";
import { Story, StorySession, StoryMessage } from "@/types/story";

export class DatabaseService {
  // 故事相关操作
  async createStory(story: Story) {
    const { error } = await supabase.from("stories").insert(story);
    if (error) throw error;
  }

  async getStories() {
    const { data, error } = await supabase
      .from("stories")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return data;
  }

  async updateStory(id: string, updates: Partial<Story>) {
    const { error } = await supabase
      .from("stories")
      .update(updates)
      .eq("id", id);
    if (error) throw error;
  }

  async deleteStory(id: string) {
    const { error } = await supabase.from("stories").delete().eq("id", id);
    if (error) throw error;
  }

  // 会话相关操作
  async createSession(session: StorySession) {
    const { error } = await supabase.from("sessions").insert(session);
    if (error) throw error;
  }

  async getStorySessions(storyId: string) {
    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .eq("story_id", storyId)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return data;
  }

  async updateSession(id: string, updates: Partial<StorySession>) {
    const { error } = await supabase
      .from("sessions")
      .update(updates)
      .eq("id", id);
    if (error) throw error;
  }

  async deleteSession(id: string) {
    const { error } = await supabase.from("sessions").delete().eq("id", id);
    if (error) throw error;
  }

  // 消息相关操作
  async addMessage(message: StoryMessage) {
    const { error } = await supabase.from("messages").insert(message);
    if (error) throw error;
  }

  async getSessionMessages(sessionId: string) {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("timestamp", { ascending: true });
    if (error) throw error;
    return data;
  }

  async updateMessage(id: string, updates: Partial<StoryMessage>) {
    const { error } = await supabase
      .from("messages")
      .update(updates)
      .eq("id", id);
    if (error) throw error;
  }

  async deleteMessage(id: string) {
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (error) throw error;
  }

  // 实用方法
  async getStoryWithSessions(storyId: string) {
    const { data: story, error: storyError } = await supabase
      .from("stories")
      .select("*")
      .eq("id", storyId)
      .single();
    if (storyError) throw storyError;

    const { data: sessions, error: sessionsError } = await supabase
      .from("sessions")
      .select("*")
      .eq("story_id", storyId)
      .order("created_at", { ascending: true });
    if (sessionsError) throw sessionsError;

    return { story, sessions };
  }

  async getSessionWithMessages(sessionId: string) {
    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .select("*")
      .eq("id", sessionId)
      .single();
    if (sessionError) throw sessionError;

    const { data: messages, error: messagesError } = await supabase
      .from("messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("timestamp", { ascending: true });
    if (messagesError) throw messagesError;

    return { session, messages };
  }
}

export const db = new DatabaseService();
