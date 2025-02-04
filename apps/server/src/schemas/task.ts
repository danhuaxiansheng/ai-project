import { z } from "zod";

export const executeTaskSchema = z.object({
  task: z.string().min(1, "任务内容不能为空"),
});
