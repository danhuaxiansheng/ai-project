import { Router } from "express";
import { ChapterController } from "../controllers/chapter";
import { validate } from "../middleware/validate";
import { createChapterSchema, updateChapterSchema } from "../schemas/chapter";

const router = Router();
const controller = new ChapterController();

const asyncHandler = (fn: Function) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.get(
  "/novels/:novelId/chapters",
  asyncHandler(controller.getNovelChapters)
);
router.get(
  "/novels/:novelId/chapters/:chapterNumber",
  asyncHandler(controller.getChapter)
);
router.post(
  "/novels/:novelId/chapters",
  validate(createChapterSchema),
  asyncHandler(controller.createChapter)
);
router.put(
  "/novels/:novelId/chapters/:chapterNumber",
  validate(updateChapterSchema),
  asyncHandler(controller.updateChapter)
);
router.delete(
  "/novels/:novelId/chapters/:chapterNumber",
  asyncHandler(controller.deleteChapter)
);

export const chapterRoutes = router;
