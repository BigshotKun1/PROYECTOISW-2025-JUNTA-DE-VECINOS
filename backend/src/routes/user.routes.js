"use strict";
import { Router } from "express";
import { isAdminyDirectiva } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  subirCertificadoResidencia,
  updateUser,
} from "../controllers/user.controller.js";
import { uploadCertificados } from "../utils/multerCertificados.js";

const router = Router();

router.use(authenticateJwt);

router.use(authenticateJwt).use(isAdminyDirectiva);
router
  .post("/crear", createUser)
  .get("/", getUsers)
  .get("/detail/", getUser)
  .patch("/detail/", updateUser)
  .delete("/detail/", deleteUser)
  .post(
    "/:rut/upload-certificado",
    uploadCertificados.single("certificado"),
    subirCertificadoResidencia,
  );

export default router;
