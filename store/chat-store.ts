import { create } from "zustand";
import { Message, ChatState } from "@/types/message";
import { nanoid } from "nanoid";
import { StorageService } from "@/services/storage";

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  addMessage: (message) =>
    set((state) => {
      const newMessage = {
        id: nanoid(),
        timestamp: Date.now(),
        status: "sending",
        ...message,
      };
      const newMessages = [...state.messages, newMessage];
      StorageService.saveMessagesToCache(newMessages);
      return { messages: newMessages };
    }),
  setMessageStatus: (id, status) =>
    set((state) => {
      const newMessages = state.messages.map((msg) =>
        msg.id === id ? { ...msg, status } : msg
      );
      StorageService.saveMessagesToCache(newMessages);
      return { messages: newMessages };
    }),
  clearMessages: () =>
    set(() => {
      StorageService.clearMessageCache();
      return { messages: [] };
    }),
  loadMessages: () =>
    set(() => ({
      messages: StorageService.getMessagesFromCache(),
    })),
}));
