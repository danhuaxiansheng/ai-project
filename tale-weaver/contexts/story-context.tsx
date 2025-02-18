"use client";

import { createContext, useContext, useState, useCallback } from "react";
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

  const refreshStories = useCallback(async () => {
    try {
      const fetchedStories = await database.getStories();
      setStories(fetchedStories);

      // 如果当前故事不在列表中，重置当前故事
      if (
        currentStory &&
        !fetchedStories.find((s) => s.id === currentStory.id)
      ) {
        setCurrentStory(null);
      }
    } catch (error) {
      console.error("Failed to refresh stories:", error);
    }
  }, [currentStory]);

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
