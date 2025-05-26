"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";  
import directivaRoutes from "./directiva.routes.js";
import eventoRoutes from "./evento.routes.js";
import meetingRoutes from "./meeting.routes.js";
import estadoRoutes from "./estado.routes.js";
import inscripcionesRoutes from "./inscripcion_reunion.routes.js"

const router = Router();

router
    .use("/auth", authRoutes)
    .use("/user", userRoutes)
    .use("/directiva", directivaRoutes)
    .use("/meetings",meetingRoutes)
    .use("/estados",estadoRoutes) 
    .use("/eventos", eventoRoutes)
    .use("/inscripciones",inscripcionesRoutes);

export default router;