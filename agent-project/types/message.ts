import { Role } from "./role";

export type MessageType = "user" | "assistant";
export type MessageStatus = "pending" | "success" | "error";

export interface Message {
  id: string;
  content: string;
  role: Role;
  timestamp: number;
  type: MessageType;
  status: MessageStatus;
  parentId?: string; // 用于追踪消息关系
  version?: number; // 用于追踪重新生成的版本
}

export interface ChatState {
  messages: Message[];
  currentRole: Role | null;
  isLoading: boolean;
  error: string | null;
  setCurrentRole: (role: Role) => void;
  addMessage: (message: Message) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  regenerateMessage: (id: string) => Promise<void>;
  clearMessages: () => void;
  loadMessages: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}
