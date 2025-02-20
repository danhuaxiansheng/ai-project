"use client";

import { useState } from "react";
import { Character } from "@/types/character";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CharacterTags } from "./character-tags";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { CharacterRelationshipEditor } from "./character-relationship-editor";

const characterSchema = z.object({
  name: z.string().min(1, "角色名称不能为空"),
  role: z.enum(["protagonist", "antagonist", "supporting"]),
  description: z.string().min(1, "角色描述不能为空"),
  background: z.string(),
  attributes: z.object({
    age: z.string().optional(),
    gender: z.string().optional(),
    occupation: z.string().optional(),
    birthplace: z.string().optional(),
  }),
  tags: z.array(z.string()),
  personality: z.object({
    extraversion: z.number().min(0).max(10).optional(),
    openness: z.number().min(0).max(10).optional(),
    conscientiousness: z.number().min(0).max(10).optional(),
    agreeableness: z.number().min(0).max(10).optional(),
    neuroticism: z.number().min(0).max(10).optional(),
    analysis: z.string().optional(),
  }).optional(),
  relationships: z.array(z.object({
    targetId: z.string(),
    type: z.enum(["friend", "enemy", "family", "lover", "other"]),
    description: z.string(),
    strength: z.number().min(1).max(5),
    bidirectional: z.boolean(),
  })),
});

interface CharacterEditorProps {
  character?: Character;
  characters: Character[];
  onSave: (character: Partial<Character>) => void;
  onCancel: () => void;
}

type FieldType<T = any> = {
  field: {
    value: T;
    onChange: (value: T) => void;
    [key: string]: any;
  };
};

const personalityDescriptions = {
  extraversion: {
    low: "内向、安静、独处",
    high: "外向、活跃、社交"
  },
  openness: {
    low: "传统、实际、保守",
    high: "创新、好奇、开放"
  },
  conscientiousness: {
    low: "随性、灵活、自由",
    high: "负责、有序、谨慎"
  },
  agreeableness: {
    low: "独立、直接、竞争",
    high: "友善、合作、同理"
  },
  neuroticism: {
    low: "情绪波动、敏感",
    high: "情绪稳定、冷静"
  }
};

export function CharacterEditor({ character, characters, onSave, onCancel }: CharacterEditorProps) {
  const [activeTab, setActiveTab] = useState("basic");
  
  const form = useForm<z.infer<typeof characterSchema>>({
    resolver: zodResolver(characterSchema),
    defaultValues: {
      name: character?.name || "",
      role: character?.role || "supporting",
      description: character?.description || "",
      background: character?.background || "",
      attributes: {
        age: character?.attributes.age || "",
        gender: character?.attributes.gender || "",
        occupation: character?.attributes.occupation || "",
        birthplace: character?.attributes.birthplace || "",
      },
      tags: character?.tags || [],
      personality: character?.personality || {
        extraversion: 5,
        openness: 5,
        conscientiousness: 5,
        agreeableness: 5,
        neuroticism: 5,
      },
      relationships: character?.relationships || [],
    },
  });

  const onSubmit = (values: z.infer<typeof characterSchema>) => {
    onSave(values);
  };

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {character ? "编辑角色" : "创建角色"}
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onCancel}>
                取消
              </Button>
              <Button type="submit">保存</Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="basic">基本信息</TabsTrigger>
              <TabsTrigger value="attributes">角色属性</TabsTrigger>
              <TabsTrigger value="background">背景故事</TabsTrigger>
              <TabsTrigger value="personality">性格特征</TabsTrigger>
              <TabsTrigger value="relationships">角色关系</TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[calc(100vh-300px)]">
              <TabsContent value="basic" className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }: FieldType<string>) => (
                    <FormItem>
                      <FormLabel>角色名称</FormLabel>
                      <FormControl>
                        <Input placeholder="输入角色名称" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }: FieldType<"protagonist" | "antagonist" | "supporting">) => (
                    <FormItem>
                      <FormLabel>角色定位</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择角色定位" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="protagonist">主角</SelectItem>
                          <SelectItem value="antagonist">反派</SelectItem>
                          <SelectItem value="supporting">配角</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }: FieldType<string>) => (
                    <FormItem>
                      <FormLabel>角色描述</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="简要描述角色的特点和形象"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }: FieldType<string[]>) => (
                    <FormItem>
                      <FormLabel>角色标签</FormLabel>
                      <FormControl>
                        <CharacterTags
                          tags={field.value}
                          onChange={field.onChange}
                          suggestions={[
                            "勇敢", "聪明", "正义", "邪恶", "神秘",
                            "幽默", "忠诚", "叛逆", "温柔", "冷酷"
                          ]}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="attributes" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="attributes.age"
                    render={({ field }: FieldType<string>) => (
                      <FormItem>
                        <FormLabel>年龄</FormLabel>
                        <FormControl>
                          <Input placeholder="输入年龄" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="attributes.gender"
                    render={({ field }: FieldType<string>) => (
                      <FormItem>
                        <FormLabel>性别</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="选择性别" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">男</SelectItem>
                            <SelectItem value="female">女</SelectItem>
                            <SelectItem value="other">其他</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="attributes.occupation"
                    render={({ field }: FieldType<string>) => (
                      <FormItem>
                        <FormLabel>职业</FormLabel>
                        <FormControl>
                          <Input placeholder="输入职业" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="attributes.birthplace"
                    render={({ field }: FieldType<string>) => (
                      <FormItem>
                        <FormLabel>出生地</FormLabel>
                        <FormControl>
                          <Input placeholder="输入出生地" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="background" className="space-y-4">
                <FormField
                  control={form.control}
                  name="background"
                  render={({ field }: FieldType<string>) => (
                    <FormItem>
                      <FormLabel>背景故事</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="描述角色的成长经历、重要事件等"
                          className="min-h-[300px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="personality" className="space-y-6">
                {/* 性格特征滑块 */}
                {Object.entries({
                  extraversion: "外向性",
                  openness: "开放性",
                  conscientiousness: "尽责性",
                  agreeableness: "亲和性",
                  neuroticism: "情绪稳定性"
                }).map(([key, label]) => (
                  <FormField
                    key={key}
                    control={form.control}
                    name={`personality.${key}`}
                    render={({ field }: FieldType<number>) => (
                      <FormItem>
                        <div className="flex items-center justify-between mb-2">
                          <FormLabel>{label}</FormLabel>
                          <span className="text-sm text-muted-foreground">
                            {field.value}
                          </span>
                        </div>
                        <FormControl>
                          <Slider
                            min={0}
                            max={10}
                            step={1}
                            value={[field.value]}
                            onValueChange={([value]) => field.onChange(value)}
                            className="w-full"
                          />
                        </FormControl>
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>{personalityDescriptions[key as keyof typeof personalityDescriptions].low}</span>
                          <span>{personalityDescriptions[key as keyof typeof personalityDescriptions].high}</span>
                        </div>
                      </FormItem>
                    )}
                  />
                ))}

                {/* 性格分析文本框 */}
                <FormField
                  control={form.control}
                  name="personality.analysis"
                  render={({ field }: FieldType<string>) => (
                    <FormItem>
                      <FormLabel>性格分析</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="分析角色的性格特点和行为模式"
                          className="min-h-[150px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="relationships">
                <CharacterRelationshipEditor
                  character={character || {
                    id: "",
                    storyId: "",
                    name: "",
                    role: "supporting",
                    description: "",
                    background: "",
                    tags: [],
                    attributes: {},
                    relationships: [],
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                  }}
                  characters={characters}
                  onSave={(relationships) => {
                    form.setValue("relationships", relationships);
                  }}
                />
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </form>
      </Form>
    </Card>
  );
} 