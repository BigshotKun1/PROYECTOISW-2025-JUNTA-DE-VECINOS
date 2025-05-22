import { Router } from "express";
import { createDirectiva } from "../controllers/directiva.controller.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = Router();

router
    .use(authenticateJwt)
    .use(isAdmin);

router.post("/", createDirectiva);

export default router;
