"use client";

import { Character } from "@/types/character";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface CharacterAnalysisProps {
  character: Character;
}

export function CharacterAnalysis({ character }: CharacterAnalysisProps) {
  const personality = character.personality || {
    extraversion: 5,
    openness: 5,
    conscientiousness: 5,
    agreeableness: 5,
    neuroticism: 5,
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">角色分析</h3>
      <Tabs defaultValue="personality" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personality">性格特征</TabsTrigger>
          <TabsTrigger value="influence">影响力分析</TabsTrigger>
          <TabsTrigger value="development">发展轨迹</TabsTrigger>
        </TabsList>

        <TabsContent value="personality" className="space-y-4">
          {Object.entries({
            extraversion: { label: "外向性", description: "社交倾向和能量水平" },
            openness: { label: "开放性", description: "对新体验的接受程度" },
            conscientiousness: { label: "尽责性", description: "计划性和可靠性" },
            agreeableness: { label: "亲和性", description: "与他人相处的和谐度" },
            neuroticism: { label: "情绪稳定性", description: "情绪控制和压力应对" },
          }).map(([key, { label, description }]) => (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{label}</div>
                  <div className="text-sm text-muted-foreground">{description}</div>
                </div>
                <span className="text-sm font-medium">
                  {personality[key as keyof typeof personality]}/10
                </span>
              </div>
              <Progress 
                value={personality[key as keyof typeof personality] * 10} 
                className="h-2"
              />
            </div>
          ))}

          {personality.analysis && (
            <div className="mt-6 space-y-2">
              <h4 className="font-medium">性格分析</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {personality.analysis}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="influence">
          <div className="text-sm text-muted-foreground">
            此功能正在开发中...
          </div>
        </TabsContent>

        <TabsContent value="development">
          <div className="text-sm text-muted-foreground">
            此功能正在开发中...
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
} 