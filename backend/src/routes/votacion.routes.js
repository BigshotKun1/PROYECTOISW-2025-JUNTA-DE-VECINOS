import { Router } from "express";
import { crearVotacion, obtenerVotacionesController, eliminarVotacion, obtenerVotacionPorIdController } from "../controllers/votacion.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdminyDirectiva } from "../middlewares/authorization.middleware.js";

const router = Router();

router.use(authenticateJwt);

router.post("/", isAdminyDirectiva, crearVotacion);
router.get("/", obtenerVotacionesController);
router.delete("/:id_votacion", isAdminyDirectiva, eliminarVotacion);
router.get("/:id", authenticateJwt, obtenerVotacionPorIdController);

export default router;