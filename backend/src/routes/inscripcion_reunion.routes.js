"use strict";
import { Router } from "express";
import { isAdmin } from "../middlewares/authorization.middleware.js"; /*->  (idPresident, isSecretary, isTreasurer)*/
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
    createInscripcion,
    deleteInscripcion,
    getInscripciones
} from "../controllers/inscripcion_reunion.controller.js";

const router = Router();

router
    .post("/", createInscripcion)
    .delete("/:id",deleteInscripcion);

router 
    .use(authenticateJwt)
    .use(isAdmin)

router
    .get("/all",getInscripciones);

export default router;