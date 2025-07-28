"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";  
import directivaRoutes from "./directiva.routes.js";
import eventoRoutes from "./evento.routes.js";
import meetingRoutes from "./meeting.routes.js";
import estadoRoutes from "./estado.routes.js";
import asistenciasRoutes from "../routes/asistencia_reunion.routes.js"
import votacionRoutes from "./votacion.routes.js";
import votoRoutes from "./voto.routes.js";
import estadoARoutes from "./estado_asistencia.routes.js";


const router = Router();

router
    .use("/auth", authRoutes)
    .use("/user", userRoutes)
    .use("/directiva", directivaRoutes)
    .use("/meetings",meetingRoutes)
    .use("/eventos", eventoRoutes)
    .use("/estados",estadoRoutes)
    .use("/asistencias",asistenciasRoutes)
    .use("/votaciones", votacionRoutes)
    .use("/votos", votoRoutes)
    .use("/estadosA",estadoARoutes);

export default router;
