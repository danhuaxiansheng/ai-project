"use client";

import { Character } from "@/types/character";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CharacterTimelineProps {
  character: Character;
  events: Array<{
    id: string;
    date: string;
    title: string;
    description: string;
    type: 'background' | 'relationship' | 'story';
    importance: 'major' | 'minor';
  }>;
}

export function CharacterTimeline({ character, events }: CharacterTimelineProps) {
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">角色时间线</h3>
      <ScrollArea className="h-[400px] pr-4">
        <div className="relative pl-8 space-y-8">
          {/* 时间线轴 */}
          <div className="absolute left-3 top-2 bottom-2 w-px bg-border" />

          {sortedEvents.map((event, index) => (
            <div key={event.id} className="relative">
              {/* 时间点 */}
              <Circle 
                className={cn(
                  "absolute -left-[27px] p-1 bg-background",
                  event.importance === 'major' ? "text-primary w-5 h-5" : "text-muted-foreground w-4 h-4"
                )}
              />
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <time className="text-sm text-muted-foreground">
                    {event.date}
                  </time>
                  <Badge variant={event.importance === 'major' ? 'default' : 'secondary'}>
                    {{
                      background: '背景',
                      relationship: '关系',
                      story: '剧情'
                    }[event.type]}
                  </Badge>
                </div>
                
                <div>
                  <h4 className="font-medium">{event.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {event.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
} 