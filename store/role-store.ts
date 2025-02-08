import { create } from "zustand";
import { Role } from "@/types/role";

interface RoleStore {
  selectedRole: Role | null;
  setSelectedRole: (role: Role | null) => void;
}

export const useRoleStore = create<RoleStore>((set) => ({
  selectedRole: null,
  setSelectedRole: (role) => set({ selectedRole: role }),
}));
