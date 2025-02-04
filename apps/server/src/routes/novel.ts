import { Router } from "express";
import { NovelController } from "../controllers/novel";

const router = Router();
const controller = new NovelController();

router.get("/", controller.getAllNovels);
router.get("/:id", controller.getNovelById);
router.post("/", controller.createNovel);
router.put("/:id", controller.updateNovel);
router.delete("/:id", controller.deleteNovel);
router.post("/:id/start", controller.startNovel);
router.post("/:id/pause", controller.pauseNovel);

export const novelRoutes = router;
