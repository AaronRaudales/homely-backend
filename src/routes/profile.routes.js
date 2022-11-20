import { Router } from "express";
import { methods as profileController } from "./../controllers/profile.controller";

const router = Router();




router.get("/:id",profileController.getUser);
router.put("/edit-profile",profileController.updateUser);
router.put("/edit-profile/role",profileController.changeRole);
router.get("/available/hosts",profileController.getHosts);

export default router;