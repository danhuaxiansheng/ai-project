import { create } from "zustand";
import { Role } from "@/types/role";

interface Collaborator {
  roleId: string;
  status: "joined" | "left" | "typing";
  lastActive: number;
}

interface CollaborationState {
  collaborators: Record<string, Collaborator>;
  addCollaborator: (roleId: string, status: Collaborator["status"]) => void;
  removeCollaborator: (roleId: string) => void;
  updateCollaboratorStatus: (
    roleId: string,
    status: Collaborator["status"]
  ) => void;
}

export const useCollaborationStore = create<CollaborationState>((set) => ({
  collaborators: {},
  addCollaborator: (roleId, status) =>
    set((state) => ({
      collaborators: {
        ...state.collaborators,
        [roleId]: {
          roleId,
          status,
          lastActive: Date.now(),
        },
      },
    })),
  removeCollaborator: (roleId) =>
    set((state) => {
      const { [roleId]: _, ...rest } = state.collaborators;
      return { collaborators: rest };
    }),
  updateCollaboratorStatus: (roleId, status) =>
    set((state) => ({
      collaborators: {
        ...state.collaborators,
        [roleId]: {
          ...state.collaborators[roleId],
          status,
          lastActive: Date.now(),
        },
      },
    })),
}));
