import express from "express";
import { createEvento, getAllEventos, deleteEvento, updateEvento } from "../controllers/evento.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isDirectiva } from "../middlewares/directiva.middleware.js";
import { isAdminyDirectiva } from "../middlewares/authorization.middleware.js";
const router = express.Router();


router.post("/crear", authenticateJwt, isAdminyDirectiva, createEvento);
router.get("/", authenticateJwt, getAllEventos);
router.delete("/:id_evento", authenticateJwt, isAdminyDirectiva, deleteEvento);
router.patch("/:id_evento", authenticateJwt, isAdminyDirectiva, updateEvento);

export default router;
