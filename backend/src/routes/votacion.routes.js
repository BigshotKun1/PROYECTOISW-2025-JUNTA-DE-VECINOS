import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { verificarDirectiva } from "../middlewares/verificarDirectiva.middleware.js";
import { crearVotacion, obtenerVotacionPorId, eliminarVotacion } from "../controllers/votacion.controller.js";

const router = Router();

router.post("/", authenticateJwt, verificarDirectiva, crearVotacion);
router.get("/:id", authenticateJwt, obtenerVotacionPorId);
router.delete("/:id", authenticateJwt, verificarDirectiva, eliminarVotacion);

export default router;
           