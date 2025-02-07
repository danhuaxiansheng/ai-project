import { Role } from "./role";

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
  status: "sending" | "sent" | "error";
}

export interface ChatState {
  messages: Message[];
  addMessage: (message: Omit<Message, "id" | "timestamp" | "status">) => void;
  setMessageStatus: (id: string, status: Message["status"]) => void;
}
