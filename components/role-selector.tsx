"use client";

import { cn } from "@/lib/utils";
import { Role, RoleCategory, roles } from "@/types/role";
import { motion } from "framer-motion";

interface RoleSelectorProps extends React.HTMLAttributes<HTMLDivElement> {
  selectedRole?: Role;
  onRoleSelect?: (role: Role) => void;
}

const categoryNames: Record<RoleCategory, string> = {
  management: "管理层",
  creation: "创作层",
  quality: "质控层",
};

export function RoleSelector({
  selectedRole,
  onRoleSelect,
  className,
  ...props
}: RoleSelectorProps) {
  // 按类别分组角色
  const rolesByCategory = roles.reduce((acc, role) => {
    if (!acc[role.category]) {
      acc[role.category] = [];
    }
    acc[role.category].push(role);
    return acc;
  }, {} as Record<RoleCategory, Role[]>);

  return (
    <div className={cn("space-y-6", className)} {...props}>
      {(Object.keys(rolesByCategory) as RoleCategory[]).map((category) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-2"
        >
          <h3 className="text-sm font-medium text-muted-foreground">
            {categoryNames[category]}
          </h3>
          <div className="space-y-1">
            {rolesByCategory[category].map((role) => (
              <motion.button
                key={role.id}
                onClick={() => onRoleSelect?.(role)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                  "hover:bg-muted",
                  selectedRole?.id === role.id &&
                    "bg-primary text-primary-foreground"
                )}
              >
                <div className="flex items-center gap-2">
                  <role.icon className="w-4 h-4" />
                  <div className="flex-1">
                    <div className="font-medium">{role.name}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {role.description}
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
