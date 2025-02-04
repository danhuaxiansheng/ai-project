import { z } from "zod";

export const createChapterSchema = z.object({
  title: z.string().min(1, "标题不能为空").max(100, "标题过长"),
  content: z.string().min(1, "内容不能为空"),
  chapterNumber: z.number().min(1, "章节号必须大于0"),
});

export const updateChapterSchema = z.object({
  title: z.string().min(1, "标题不能为空").max(100, "标题过长").optional(),
  content: z.string().min(1, "内容不能为空").optional(),
});
