"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { Story } from "@/types/story";
import { database } from "@/services/db";

interface StoryContextType {
  stories: Story[];
  currentStory: Story | null;
  setCurrentStory: (story: Story | null) => void;
  refreshStories: () => Promise<void>;
}

const StoryContext = createContext<StoryContextType | undefined>(undefined);

export function StoryProvider({ children }: { children: React.ReactNode }) {
  const [stories, setStories] = useState<Story[]>([]);
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const refreshStories = useCallback(async () => {
    if (!isInitialized) return;
    try {
      const fetchedStories = await database.getStories();
      setStories(fetchedStories);
      setCurrentStory((current) => {
        if (!current) return null;
        return fetchedStories.find((s) => s.id === current.id) || null;
      });
    } catch (error) {
      console.error("Failed to refresh stories:", error);
    }
  }, [isInitialized]);

  // 只在组件挂载时初始化一次
  useEffect(() => {
    const init = async () => {
      const fetchedStories = await database.getStories();
      setStories(fetchedStories);
      setIsInitialized(true);
    };
    init();
  }, []);

  return (
    <StoryContext.Provider
      value={{
        stories,
        currentStory,
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
