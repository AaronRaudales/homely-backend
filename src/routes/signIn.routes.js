import { Router } from "express";
import { methods as signInController } from "./../controllers/signIn.controller";

const router = Router();

router.post("/", signInController.signIn);

export default router;