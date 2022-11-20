import { Router } from "express";
import { methods as reservationController } from "../controllers/reservation.controller";
const router = Router();

//POST AGREGAR RESERVACION
router.post("/add", reservationController.addReservation);


export default router;