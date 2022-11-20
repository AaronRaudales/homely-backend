import { Router } from "express";
import { methods as filterController } from "./../controllers/filter.controller";

const router = Router();

router.post("/",filterController.getPropertyFilter);

export default router;