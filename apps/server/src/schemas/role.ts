import { z } from "zod";

export const createRoleSchema = z.object({
  type: z.enum(["writer", "reviewer", "rater"], {
    required_error: "角色类型是必需的",
    invalid_type_error: "无效的角色类型",
  }),
});

export const updateRoleSchema = z.object({
  name: z.string().min(1, "名称不能为空").max(50, "名称过长").optional(),
  settings: z
    .object({
      creativity: z.number().min(0).max(100).optional(),
      strictness: z.number().min(0).max(100).optional(),
      speed: z.number().min(0).max(100).optional(),
      style: z.array(z.string()).optional(),
      constraints: z.array(z.string()).optional(),
    })
    .optional(),
});
