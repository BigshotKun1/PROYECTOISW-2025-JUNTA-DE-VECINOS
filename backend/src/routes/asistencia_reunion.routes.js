"use strict";
import { Router } from "express";
import { isAdmin } from "../middlewares/authorization.middleware.js"; /*->  (idPresident, isSecretary, isTreasurer)*/
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
    getAsistencia
} from "../controllers/asistencia_reunion.controller.js";

const router = Router();

route 
    .get("/:id",getAsistencia)
