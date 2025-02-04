import { useState } from "react";
import { useGlobalMonitor } from "@/lib/hooks/useGlobalMonitor";
import { controlAPI } from "@/lib/api/control";
import { Role, RoleAdjustment } from "@/types/role";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";
import { RoleMonitor } from "../monitor/RoleMonitor";

export function CommandPanel() {
  const { roles, alerts } = useGlobalMonitor();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const handleEmergencyStop = async () => {
    try {
      await controlAPI.pauseAll();
      toast({
        title: "系统已暂停",
        description: "所有角色操作已暂停",
        variant: "warning",
      });
    } catch (error) {
      toast({
        title: "操作失败",
        description: "暂停系统失败，请重试",
        variant: "destructive",
      });
    }
  };

  const handleRoleAdjustment = async (adjustment: RoleAdjustment) => {
    if (!selectedRole) return;

    try {
      await controlAPI.adjustRole(selectedRole.id, adjustment);
      toast({
        title: "角色已调整",
        description: `${selectedRole.name} 的参数已更新`,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "调整失败",
        description: "更新角色参数失败，请重试",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-12 gap-4 p-4">
      {/* 左侧角色监控 */}
      <div className="col-span-3 space-y-4">
        {roles.map((role) => (
          <RoleMonitor key={role.id} role={role} onSelect={setSelectedRole} />
        ))}
      </div>

      {/* 中间控制面板 */}
      <div className="col-span-6">
        <div className="space-y-4">
          <Button
            variant="destructive"
            size="lg"
            className="w-full"
            onClick={handleEmergencyStop}
          >
            紧急停止所有操作
          </Button>

          {selectedRole && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                调整 {selectedRole.name} 的参数
              </h3>
              <AdjustmentControls
                role={selectedRole}
                onAdjust={handleRoleAdjustment}
              />
            </div>
          )}
        </div>
      </div>

      {/* 右侧警报面板 */}
      <div className="col-span-3 space-y-2">
        {alerts.map((alert) => (
          <Alert key={alert.id} variant={alert.severity}>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        ))}
      </div>
    </div>
  );
}
