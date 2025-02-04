import { Router } from "express";
import { RoleController } from "../controllers/role";

const router = Router();
const controller = new RoleController();

router.get("/", controller.getAllRoles);
router.get("/:id", controller.getRoleById);
router.post("/", controller.createRole);
router.put("/:id", controller.updateRole);
router.delete("/:id", controller.deleteRole);
router.post("/:id/start", controller.startRole);
router.post("/:id/pause", controller.pauseRole);

export const roleRoutes = router;
