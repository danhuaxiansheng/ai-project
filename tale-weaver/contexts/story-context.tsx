"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { Story, StoryCreateInput, StoryUpdateInput } from "@/types/story";
import * as db from "@/lib/db";
import { nanoid } from "nanoid";
import { useToast } from "@/components/ui/use-toast";
import { generateUUID } from "@/lib/utils";

interface StoryContextType {
  stories: Story[];
  currentStory: Story | null;
  isLoading: boolean;
  error: Error | null;
  createStory: (data: StoryCreateInput) => Promise<Story>;
  updateStory: (id: string, updates: StoryUpdateInput) => Promise<void>;
  deleteStory: (id: string) => Promise<void>;
  setCurrentStory: (story: Story | null) => void;
  refreshStories: () => Promise<void>;
}

const StoryContext = createContext<StoryContextType | undefined>(undefined);

export function StoryProvider({ children }: { children: React.ReactNode }) {
  const [stories, setStories] = useState<Story[]>([]);
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  // 初始化数据库和加载故事
  useEffect(() => {
    const init = async () => {
      try {
        // 确保数据库已初始化
        await db.initDatabase();
        const loadedStories = await db.getStories();
        setStories(loadedStories);
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize:', error);
        setError(error instanceof Error ? error : new Error('初始化失败'));
        toast({
          title: "错误",
          description: "初始化失败，请刷新页面重试",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const refreshStories = async () => {
    setIsLoading(true);
    try {
      const fetchedStories = await db.getStories();
      setStories(fetchedStories);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('获取故事列表失败');
      setError(error);
      toast({
        title: "错误",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createStory = async (storyData: StoryCreateInput): Promise<Story> => {
    const story: Story = {
      id: generateUUID(),
      ...storyData,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    try {
      await db.createStory(story);
      setStories(prev => [...prev, story]);
      toast({
        title: "成功",
        description: "故事创建成功",
      });
      return story;
    } catch (error) {
      console.error('Failed to create story:', error);
      toast({
        title: "错误",
        description: "创建故事失败",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateStory = useCallback(async (id: string, updates: StoryUpdateInput) => {
    try {
      const updatedStory = {
        ...updates,
        updatedAt: Date.now(),
      };
      await db.updateStory(id, updatedStory);
      
      setStories(prev => prev.map(story => 
        story.id === id ? { ...story, ...updatedStory } : story
      ));

      if (currentStory?.id === id) {
        setCurrentStory(prev => prev ? { ...prev, ...updatedStory } : prev);
      }
    } catch (error) {
      console.error('Failed to update story:', error);
      throw error;
    }
  }, [currentStory]);

  const deleteStory = useCallback(async (id: string) => {
    try {
      await db.deleteStory(id);
      setStories(prev => prev.filter(story => story.id !== id));
      if (currentStory?.id === id) {
        setCurrentStory(null);
      }
    } catch (error) {
      console.error('Failed to delete story:', error);
      throw error;
    }
  }, [currentStory]);

  // 如果数据库还未初始化，显示加载状态
  if (!isInitialized) {
    return <div>正在初始化...</div>;
  }

  return (
    <StoryContext.Provider
      value={{
        stories,
        currentStory,
        isLoading,
        error,
        createStory,
        updateStory,
        deleteStory,
        setCurrentStory,
        refreshStories,
      }}
    >
      {children}
    </StoryContext.Provider>
  );
}

export function useStory() {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error("useStory must be used within StoryProvider");
  }
  return context;
}
