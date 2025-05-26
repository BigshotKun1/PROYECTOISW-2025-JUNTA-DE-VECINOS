"use strict";
import { Router } from "express";
import { isAdmin } from "../middlewares/authorization.middleware.js"; /*->  (idPresident, isSecretary, isTreasurer)*/
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
    getAsistencias,
    updateAsistencia
} from "../controllers/asistencia_reunion.controller.js";

const router = Router();

router 
    .get("/:id",getAsistencias)
    .patch("/:id",updateAsistencia)

export default router