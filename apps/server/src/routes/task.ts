import { Router } from "express";
import { TaskController } from "../controllers/task";
import { validate } from "../middleware/validate";
import { executeTaskSchema } from "../schemas/task";

const router = Router();
const controller = new TaskController();

const asyncHandler = (fn: Function) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.post(
  "/roles/:roleId/novels/:novelId/execute",
  validate(executeTaskSchema),
  asyncHandler(controller.executeTask)
);

export const taskRoutes = router;
