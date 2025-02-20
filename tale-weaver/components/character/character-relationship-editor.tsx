"use client";

import { useState } from "react";
import { Character, CharacterRelationship } from "@/types/character";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Plus, X } from "lucide-react";

interface CharacterRelationshipEditorProps {
  character: Character;
  characters: Character[];
  onSave: (relationships: CharacterRelationship[]) => void;
}

export function CharacterRelationshipEditor({
  character,
  characters,
  onSave,
}: CharacterRelationshipEditorProps) {
  const [relationships, setRelationships] = useState<CharacterRelationship[]>(
    character.relationships || []
  );

  const addRelationship = () => {
    setRelationships([
      ...relationships,
      {
        targetId: "",
        type: "friend",
        description: "",
        strength: 3,
        bidirectional: false,
      },
    ]);
  };

  const removeRelationship = (index: number) => {
    setRelationships(relationships.filter((_, i) => i !== index));
  };

  const updateRelationship = (index: number, updates: Partial<CharacterRelationship>) => {
    setRelationships(
      relationships.map((rel, i) =>
        i === index ? { ...rel, ...updates } : rel
      )
    );
  };

  const availableCharacters = characters.filter(
    c => c.id !== character.id && !relationships.find(r => r.targetId === c.id)
  );

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">角色关系</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={addRelationship}
          disabled={availableCharacters.length === 0}
        >
          <Plus className="h-4 w-4 mr-2" />
          添加关系
        </Button>
      </div>

      <div className="space-y-4">
        {relationships.map((relationship, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">关联角色</label>
                  <Select
                    value={relationship.targetId}
                    onValueChange={(value) =>
                      updateRelationship(index, { targetId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择角色" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        ...(relationship.targetId
                          ? [characters.find(c => c.id === relationship.targetId)]
                          : []),
                        ...availableCharacters,
                      ]
                        .filter(Boolean)
                        .map(c => (
                          <SelectItem key={c!.id} value={c!.id}>
                            {c!.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">关系类型</label>
                  <Select
                    value={relationship.type}
                    onValueChange={(value) =>
                      updateRelationship(index, {
                        type: value as CharacterRelationship["type"],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="friend">朋友</SelectItem>
                      <SelectItem value="enemy">敌人</SelectItem>
                      <SelectItem value="family">家人</SelectItem>
                      <SelectItem value="lover">恋人</SelectItem>
                      <SelectItem value="other">其他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeRelationship(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">关系描述</label>
                <Input
                  value={relationship.description}
                  onChange={(e) =>
                    updateRelationship(index, { description: e.target.value })
                  }
                  placeholder="描述两个角色之间的关系"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">关系强度</label>
                  <span className="text-sm text-muted-foreground">
                    {relationship.strength}
                  </span>
                </div>
                <Slider
                  min={1}
                  max={5}
                  step={1}
                  value={[relationship.strength]}
                  onValueChange={([value]) =>
                    updateRelationship(index, { strength: value })
                  }
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>较弱</span>
                  <span>一般</span>
                  <span>较强</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`bidirectional-${index}`}
                  checked={relationship.bidirectional}
                  onChange={(e) =>
                    updateRelationship(index, { bidirectional: e.target.checked })
                  }
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label
                  htmlFor={`bidirectional-${index}`}
                  className="text-sm font-medium"
                >
                  双向关系
                </label>
              </div>
            </div>
          </Card>
        ))}

        {relationships.length > 0 && (
          <div className="flex justify-end mt-4">
            <Button onClick={() => onSave(relationships)}>保存关系</Button>
          </div>
        )}
      </div>
    </Card>
  );
} 