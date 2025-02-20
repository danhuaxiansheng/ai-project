"use client";

import { Character } from "@/types/character";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { User, Briefcase, MapPin, Calendar } from "lucide-react";

interface CharacterAttributesProps {
  attributes: Character['attributes'];
}

export function CharacterAttributes({ attributes }: CharacterAttributesProps) {
  const attributeItems = [
    {
      icon: Calendar,
      label: "年龄",
      value: attributes.age,
    },
    {
      icon: User,
      label: "性别",
      value: attributes.gender === 'male' ? '男' : 
             attributes.gender === 'female' ? '女' : 
             attributes.gender === 'other' ? '其他' : null,
    },
    {
      icon: Briefcase,
      label: "职业",
      value: attributes.occupation,
    },
    {
      icon: MapPin,
      label: "出生地",
      value: attributes.birthplace,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {attributeItems.map((item, index) => (
        item.value && (
          <Card key={index} className="p-4">
            <div className="flex items-center gap-2">
              <item.icon className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">{item.label}</div>
                <div className="font-medium">{item.value}</div>
              </div>
            </div>
          </Card>
        )
      ))}
    </div>
  );
} 