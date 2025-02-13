"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { Role } from "@/types/role";

interface Message {
  role: "assistant" | "user";
  content: string;
  timestamp: number;
}

interface StoryState {
  selectedRole: Role | null;
  messages: Message[];
  isLoading: boolean;
}

type StoryAction =
  | { type: "SET_ROLE"; payload: Role | null }
  | { type: "ADD_MESSAGE"; payload: Message }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "LOAD_MESSAGES"; payload: Message[] }
  | { type: "CLEAR_MESSAGES" };

const initialState: StoryState = {
  selectedRole: null,
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
    case "ADD_MESSAGE":
      const newMessages = [...state.messages, action.payload];
      // 保存到 localStorage
      localStorage.setItem("tale-weaver-messages", JSON.stringify(newMessages));
      return { ...state, messages: newMessages };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "LOAD_MESSAGES":
      return { ...state, messages: action.payload };
    case "CLEAR_MESSAGES":
      localStorage.removeItem("tale-weaver-messages");
      return { ...state, messages: [] };
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
        type: "LOAD_MESSAGES",
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
