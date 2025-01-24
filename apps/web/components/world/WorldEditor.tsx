"use client";

import React from "react";
import { World } from "../lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface WorldEditorProps {
  world: World;
}

export const WorldEditor: React.FC<WorldEditorProps> = ({ world }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{world.name}</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">复杂度: {world.complexity}</Badge>
            {world.focus_areas?.map((area) => (
              <Badge key={area} variant="outline">
                {area}
              </Badge>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <p>{world.description}</p>
        </CardContent>
      </Card>

      <Accordion type="single" collapsible defaultValue="geography">
        {world.geography && (
          <AccordionItem value="geography">
            <AccordionTrigger>地理环境</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">地形概述</h4>
                  <p>{world.geography.terrain.summary}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">气候特征</h4>
                  <p>{world.geography.climate.summary}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">资源分布</h4>
                  <p>{world.geography.resources.summary}</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {world.culture && (
          <AccordionItem value="culture">
            <AccordionTrigger>文明文化</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">文明概述</h4>
                  <p>{world.culture.description}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">信仰</h4>
                  <p>{world.culture.beliefs.join(", ")}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">习俗</h4>
                  <p>{world.culture.customs.join(", ")}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">艺术</h4>
                  <p>{world.culture.arts.join(", ")}</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
};
