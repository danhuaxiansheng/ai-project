"use client";

import { Card } from "@/components/ui/card";
import { Character } from "@/types/character";
import { CalendarDays, User2, Briefcase, MapPin } from "lucide-react";

interface CharacterAttributesProps {
  attributes: Character['attributes'];
}

export function CharacterAttributes({ attributes }: CharacterAttributesProps) {
  const attributeItems = [
    {
      icon: <CalendarDays className="h-4 w-4" />,
      label: "年龄",
      value: attributes.age,
      placeholder: "未设置年龄"
    },
    {
      icon: <User2 className="h-4 w-4" />,
      label: "性别",
      value: attributes.gender === 'male' ? '男' : 
             attributes.gender === 'female' ? '女' : 
             attributes.gender || '未设置性别'
    },
    {
      icon: <Briefcase className="h-4 w-4" />,
      label: "职业",
      value: attributes.occupation,
      placeholder: "未设置职业"
    },
    {
      icon: <MapPin className="h-4 w-4" />,
      label: "出生地",
      value: attributes.birthplace,
      placeholder: "未设置出生地"
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {attributeItems.map((item, index) => (
        <Card key={index} className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              {item.icon}
            </div>
            <div>
              <div className="text-sm text-muted-foreground">
                {item.label}
              </div>
              <div className="font-medium">
                {item.value || item.placeholder}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
} 