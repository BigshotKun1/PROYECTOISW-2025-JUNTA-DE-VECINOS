"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";  
import directivaRoutes from "./directiva.routes.js";
import eventoRoutes from "./evento.routes.js";


const router = Router();

router
    .use("/auth", authRoutes)
    .use("/user", userRoutes)
    .use("/directiva", directivaRoutes)
    .use("/eventos", eventoRoutes);
export default router;