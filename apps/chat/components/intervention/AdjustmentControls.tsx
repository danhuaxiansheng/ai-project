import { Role, RoleAdjustment } from "@/types/role";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface AdjustmentControlsProps {
  role: Role;
  onAdjust: (adjustment: RoleAdjustment) => void;
}

export function AdjustmentControls({
  role,
  onAdjust,
}: AdjustmentControlsProps) {
  const [settings, setSettings] = useState(role.settings);

  const handleChange = (key: keyof typeof settings, value: number) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    onAdjust({ settings });
  };

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">创造力水平</label>
          <Slider
            value={[settings.creativity]}
            onValueChange={([value]) => handleChange("creativity", value)}
            max={100}
            step={1}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">严格程度</label>
          <Slider
            value={[settings.strictness]}
            onValueChange={([value]) => handleChange("strictness", value)}
            max={100}
            step={1}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">响应速度</label>
          <Slider
            value={[settings.speed]}
            onValueChange={([value]) => handleChange("speed", value)}
            max={100}
            step={1}
          />
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => setSettings(role.settings)}>
          重置
        </Button>
        <Button onClick={handleSubmit}>应用更改</Button>
      </div>
    </div>
  );
}
