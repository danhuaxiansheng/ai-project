import { Router } from "express";
import { RoleController } from "../controllers/role";
import { validate } from "../middleware/validate";
import { createRoleSchema, updateRoleSchema } from "../schemas/role";

const router = Router();
const controller = new RoleController();

const asyncHandler = (fn: Function) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.get("/", asyncHandler(controller.getAllRoles));
router.get("/:id", asyncHandler(controller.getRoleById));
router.post(
  "/",
  validate(createRoleSchema),
  asyncHandler(controller.createRole)
);
router.put(
  "/:id",
  validate(updateRoleSchema),
  asyncHandler(controller.updateRole)
);
router.delete("/:id", asyncHandler(controller.deleteRole));
router.post("/:id/start", asyncHandler(controller.startRole));
router.post("/:id/pause", asyncHandler(controller.pauseRole));

export const roleRoutes = router;
