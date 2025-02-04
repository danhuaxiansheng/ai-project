import { z } from "zod";

export const createNovelSchema = z.object({
  title: z.string().min(1, "标题不能为空").max(100, "标题过长"),
  description: z.string().min(1, "简介不能为空").max(500, "简介过长"),
  totalChapters: z.number().min(1, "章节数至少为1"),
  settings: z.object({
    genre: z.array(z.string()).min(1, "至少选择一个类型"),
    theme: z.array(z.string()),
    targetLength: z.number().min(1000, "目标字数至少1000字"),
    style: z.array(z.string()),
    constraints: z.array(z.string()),
  }),
});

export const updateNovelSchema = createNovelSchema.partial();
