import { useCollaborationStore } from "@/store/collaboration-store";
import { roles } from "@/types/role";
import { cn } from "@/lib/utils";

export function CollaboratorsList() {
  const { collaborators } = useCollaborationStore();

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">在线角色</h3>
      <div className="space-y-1">
        {Object.values(collaborators).map((collaborator) => {
          const role = roles.find((r) => r.id === collaborator.roleId);
          if (!role) return null;

          return (
            <div
              key={role.id}
              className="flex items-center gap-2 text-sm px-2 py-1"
            >
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  collaborator.status === "typing"
                    ? "bg-green-500 animate-pulse"
                    : collaborator.status === "joined"
                    ? "bg-green-500"
                    : "bg-gray-300"
                )}
              />
              <role.icon className="w-4 h-4" />
              <span>{role.name}</span>
              {collaborator.status === "typing" && (
                <span className="text-xs text-muted-foreground">
                  正在输入...
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
