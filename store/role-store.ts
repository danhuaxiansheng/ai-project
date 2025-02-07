import { create } from "zustand";
import { Role } from "@/types/role";

interface RoleState {
  selectedRole?: Role;
  setSelectedRole: (role?: Role) => void;
}

export const useRoleStore = create<RoleState>((set) => ({
  selectedRole: undefined,
  setSelectedRole: (role) => set({ selectedRole: role }),
}));
