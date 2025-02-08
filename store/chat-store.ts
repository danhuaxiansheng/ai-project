import { create } from "zustand";
import { Message, ChatState } from "@/types/message";
import { nanoid } from "nanoid";
import { StorageService } from "@/services/storage";
import { APIService } from "@/services/api";

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  currentRole: null,
  isLoading: false,
  error: null,

  setCurrentRole: (role) => set({ currentRole: role }),

  addMessage: (message) =>
    set((state) => {
      const newMessage = {
        id: nanoid(),
        timestamp: Date.now(),
        status: "success" as const,
        version: 1,
        ...message,
      };
      const newMessages = [...state.messages, newMessage];
      StorageService.saveMessagesToCache(newMessages);
      return { messages: newMessages };
    }),

  updateMessage: (id, updates) =>
    set((state) => {
      const newMessages = state.messages.map((msg) =>
        msg.id === id ? { ...msg, ...updates } : msg
      );
      StorageService.saveMessagesToCache(newMessages);
      return { messages: newMessages };
    }),

  regenerateMessage: async (id) => {
    const state = get();
    const messageToRegenerate = state.messages.find((m) => m.id === id);
    if (!messageToRegenerate) return;

    // 找到原始的用户消息
    const userMessage = state.messages
      .slice(0, state.messages.indexOf(messageToRegenerate))
      .reverse()
      .find((m) => m.type === "user");

    if (!userMessage) return;

    try {
      set({ isLoading: true });
      const response = await APIService.chatWithAI(
        messageToRegenerate.role,
        userMessage.content
      );

      if (response.status === "success" && response.content) {
        const updatedMessage = {
          ...messageToRegenerate,
          content: response.content,
          timestamp: Date.now(),
          version: (messageToRegenerate.version || 1) + 1,
        };
        state.updateMessage(id, updatedMessage);
      }
    } catch (error) {
      console.error("重新生成失败:", error);
      set({ error: "重新生成失败" });
    } finally {
      set({ isLoading: false });
    }
  },

  clearMessages: () =>
    set(() => {
      StorageService.clearMessageCache();
      return { messages: [] };
    }),

  loadMessages: () =>
    set(() => ({
      messages: StorageService.getMessagesFromCache(),
    })),

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
