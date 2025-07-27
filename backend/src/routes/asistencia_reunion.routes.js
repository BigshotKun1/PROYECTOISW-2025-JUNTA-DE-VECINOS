"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdminyDirectiva } from "../middlewares/authorization.middleware.js";
import {
  getAsistencias,
  getEstadisticasAsistencia,
  getHistorialDeAsistencia,
  updateAsistencia,
} from "../controllers/asistencia_reunion.controller.js";

const router = Router();

router.get(
  "/historial-asistencias/:rut",
  authenticateJwt,
  getHistorialDeAsistencia,
);
router.use(authenticateJwt).use(isAdminyDirectiva);
router
  .get("/estadisticas-asistencia", getEstadisticasAsistencia)
  .get("/:id", getAsistencias)
  .patch("/:id", updateAsistencia);

export default router;
