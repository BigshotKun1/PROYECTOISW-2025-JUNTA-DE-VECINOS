import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isDirectiva } from "../middlewares/directiva.middleware.js";
import { crearVotacion, eliminarVotacion, obtenerVotacionPorIdController } from "../controllers/votacion.controller.js";

const router = Router();

router.post("/", authenticateJwt, isDirectiva, crearVotacion);
router.get("/:id", authenticateJwt, obtenerVotacionPorIdController);
router.delete("/:id_votacion", authenticateJwt, isDirectiva, eliminarVotacion);
export default router;
           