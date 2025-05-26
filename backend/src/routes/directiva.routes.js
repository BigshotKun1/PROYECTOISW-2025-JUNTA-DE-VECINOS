import { Router } from "express";
import { createDirectiva, getDirectiva, deleteDirectiva } from "../controllers/directiva.controller.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = Router();

router
    .use(authenticateJwt)
    .use(isAdmin);

router.post("/crear", createDirectiva);
router.get("/", getDirectiva);
router.delete("/:id_usuario/:id_periodo", deleteDirectiva);


export default router;
