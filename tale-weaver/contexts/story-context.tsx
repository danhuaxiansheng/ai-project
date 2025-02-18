"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { Role } from "@/types/role";
import { Story, StorySession, StoryMessage } from "@/types/story";

interface StoryState {
  selectedRole: Role | null;
  currentStory: Story | null;
  currentSession: StorySession | null;
  messages: StoryMessage[];
  isLoading: boolean;
}

type StoryAction =
  | { type: "SET_ROLE"; payload: Role | null }
  | { type: "SET_STORY"; payload: Story }
  | { type: "SET_SESSION"; payload: StorySession }
  | { type: "ADD_MESSAGE"; payload: StoryMessage }
  | { type: "SET_MESSAGES"; payload: StoryMessage[] }
  | { type: "SET_LOADING"; payload: boolean };

const initialState: StoryState = {
  selectedRole: null,
  currentStory: null,
  currentSession: null,
  messages: [],
  isLoading: false,
};

const StoryContext = createContext<{
  state: StoryState;
  dispatch: React.Dispatch<StoryAction>;
} | null>(null);

function storyReducer(state: StoryState, action: StoryAction): StoryState {
  switch (action.type) {
    case "SET_ROLE":
      return { ...state, selectedRole: action.payload };
    case "SET_STORY":
      return { ...state, currentStory: action.payload };
    case "SET_SESSION":
      return { ...state, currentSession: action.payload };
    case "ADD_MESSAGE":
      const newMessages = [...state.messages, action.payload];
      // 保存到 localStorage
      localStorage.setItem("tale-weaver-messages", JSON.stringify(newMessages));
      return { ...state, messages: newMessages };
    case "SET_MESSAGES":
      return { ...state, messages: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

export function StoryProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(storyReducer, initialState);

  // 从 localStorage 加载历史记录
  useEffect(() => {
    const savedMessages = localStorage.getItem("tale-weaver-messages");
    if (savedMessages) {
      dispatch({
        type: "SET_MESSAGES",
        payload: JSON.parse(savedMessages),
      });
    }
  }, []);

  return (
    <StoryContext.Provider value={{ state, dispatch }}>
      {children}
    </StoryContext.Provider>
  );
}

export function useStory() {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error("useStory must be used within a StoryProvider");
  }
  return context;
}
