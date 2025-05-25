"use strict";
import { Router } from "express";
import { isAdmin } from "../middlewares/authorization.middleware.js"; /*->  (idPresident, isSecretary, isTreasurer)*/
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
    createEstado,
    deleteEstado,
    getEstado
} from "../controllers/estado.controller.js";

const router = Router();

router 
    .use(authenticateJwt)
    .use(isAdmin)

router
    .post("/", createEstado)
    .delete("/:id",deleteEstado)
    .get("/all", getEstado);

export default router;