import express from "express";
import { createEvento, getAllEventos } from "../controllers/evento.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isDirectiva } from "../middlewares/directiva.middleware.js";
const router = express.Router();


router.post("/crear", authenticateJwt, isDirectiva, createEvento);
router.get("/", getAllEventos);

export default router;
