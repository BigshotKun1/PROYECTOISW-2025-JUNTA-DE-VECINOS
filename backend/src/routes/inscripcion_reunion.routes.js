"use strict";
import { Router } from "express";
import { isAdminyDirectiva } from "../middlewares/authorization.middleware.js"; 
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
    createInscripcion,
    deleteInscripcion,
    getInscripciones
} from "../controllers/inscripcion_reunion.controller.js";

const router = Router();

router
    .post("/", authenticateJwt, createInscripcion)
    .delete("/:id", authenticateJwt, deleteInscripcion)
    .get("/all", authenticateJwt, isAdminyDirectiva, getInscripciones);

export default router;