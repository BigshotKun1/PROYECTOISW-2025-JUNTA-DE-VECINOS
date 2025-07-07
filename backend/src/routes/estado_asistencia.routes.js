"use strict";
import { Router } from "express";
import { isAdmin } from "../middlewares/authorization.middleware.js"; 
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
    createEstadoAsistencia,
    deleteEstadoAsistencia,
    getEstadoAsistencia
} from "../controllers/estado_asistencia.controller.js";

const router = Router();

router 
    .use(authenticateJwt)
    .use(isAdmin);
    
router
    .post("/", createEstadoAsistencia)
    .delete("/:id",deleteEstadoAsistencia)
    .get("/all", getEstadoAsistencia);

export default router;