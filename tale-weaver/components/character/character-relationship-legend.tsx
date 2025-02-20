"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Users, Swords, Home, Heart, HelpCircle } from "lucide-react";

export function CharacterRelationshipLegend() {
  const relationshipTypes = [
    { type: 'friend', label: '朋友', icon: Users, color: '#22c55e' },
    { type: 'enemy', label: '敌人', icon: Swords, color: '#ef4444' },
    { type: 'family', label: '家人', icon: Home, color: '#3b82f6' },
    { type: 'lover', label: '恋人', icon: Heart, color: '#ec4899' },
    { type: 'other', label: '其他', icon: HelpCircle, color: '#6b7280' },
  ];

  const roleTypes = [
    { role: 'protagonist', label: '主角', color: '#3b82f6' },
    { role: 'antagonist', label: '反派', color: '#ef4444' },
    { role: 'supporting', label: '配角', color: '#6b7280' },
  ];

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">角色类型</h4>
          <div className="flex flex-wrap gap-2">
            {roleTypes.map(({ role, label, color }) => (
              <div key={role} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">关系类型</h4>
          <div className="flex flex-wrap gap-2">
            {relationshipTypes.map(({ type, label, icon: Icon, color }) => (
              <div key={type} className="flex items-center gap-2">
                <Icon className="h-4 w-4" style={{ color }} />
                <span className="text-sm text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">关系强度</h4>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-1 w-8 bg-primary/30" />
              <span className="text-sm text-muted-foreground">弱</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1 w-8 bg-primary" />
              <span className="text-sm text-muted-foreground">强</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">其他说明</h4>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-muted-foreground">双向关系</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-primary/50" />
              <span className="text-sm text-muted-foreground">节点大小表示关系数量</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
} 