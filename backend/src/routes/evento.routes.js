import express from "express";
import { createEvento, getAllEventos, deleteEvento, updateEvento } from "../controllers/evento.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isDirectiva } from "../middlewares/directiva.middleware.js";
const router = express.Router();


router.post("/crear", authenticateJwt, isDirectiva, createEvento);
router.get("/", getAllEventos);
router.delete("/:id_evento", authenticateJwt, isDirectiva, deleteEvento);
router.patch("/:id_evento", authenticateJwt, isDirectiva, updateEvento);

export default router;
