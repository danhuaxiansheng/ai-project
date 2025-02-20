"use client";

import { Character } from "@/types/character";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CharacterPersonalityChart } from "./character-personality-chart";
import { CharacterInfluenceMap } from "./character-influence-map";

interface CharacterAnalysisProps {
  character: Character;
  characters: Character[];
}

export function CharacterAnalysis({ character, characters }: CharacterAnalysisProps) {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">角色分析</h3>
      
      <Tabs defaultValue="personality">
        <TabsList className="mb-4">
          <TabsTrigger value="personality">性格特征</TabsTrigger>
          <TabsTrigger value="influence">影响力分析</TabsTrigger>
          <TabsTrigger value="development">发展轨迹</TabsTrigger>
        </TabsList>

        <TabsContent value="personality">
          <CharacterPersonalityChart character={character} />
        </TabsContent>

        <TabsContent value="influence">
          <CharacterInfluenceMap character={character} characters={characters} />
        </TabsContent>

        <TabsContent value="development">
          <div className="space-y-4">
            <div className="grid gap-4">
              {/* 角色发展阶段 */}
              {character.development?.stages.map((stage, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge>{stage.phase}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {stage.timeframe}
                    </span>
                  </div>
                  <h4 className="font-medium mb-1">{stage.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {stage.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
} 