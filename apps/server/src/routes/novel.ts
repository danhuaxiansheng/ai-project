import { Router } from "express";
import { NovelController } from "../controllers/novel";
import { validate } from "../middleware/validate";
import { createNovelSchema, updateNovelSchema } from "../schemas/novel";

const router = Router();
const controller = new NovelController();

// 添加错误处理中间件
const asyncHandler = (fn: Function) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.get("/", asyncHandler(controller.getAllNovels));
router.get("/:id", asyncHandler(controller.getNovelById));
router.post(
  "/",
  validate(createNovelSchema),
  asyncHandler(controller.createNovel)
);
router.put(
  "/:id",
  validate(updateNovelSchema),
  asyncHandler(controller.updateNovel)
);
router.delete("/:id", asyncHandler(controller.deleteNovel));
router.post("/:id/start", asyncHandler(controller.startNovel));
router.post("/:id/pause", asyncHandler(controller.pauseNovel));

export const novelRoutes = router;
