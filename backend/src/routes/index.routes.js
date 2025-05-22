"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";

import authRoutes from "./auth.routes.js";  
import directivaRoutes from "./directiva.routes.js";
import meetingRoutes from "./meeting.routes.js";


const router = Router();

router
    .use("/auth", authRoutes)
    .use("/user", userRoutes)
    .use("/directiva", directivaRoutes);
    .use("/meetings",meetingRoutes);


export default router;