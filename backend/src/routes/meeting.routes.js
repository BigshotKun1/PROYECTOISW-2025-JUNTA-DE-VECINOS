"use strict";
import { Router } from "express";
import { isAdminyDirectiva } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  createMeeting,
  deleteActa,
  deleteMeeting,
  getMeeting,
  getMeetings,
  updateMeeting,
} from "../controllers/meeting.controller.js";
import { upload } from "../utils/multerConfig.js";
import { subirActaReunion } from "../controllers/meeting.controller.js";

const router = Router();

router.get("/all", authenticateJwt, getMeetings);
router.get("/:id", authenticateJwt, getMeeting);
router.use(authenticateJwt).use(isAdminyDirectiva);
router
  .patch("/:id", updateMeeting)
  .delete("/:id", deleteMeeting)
  .post("/", createMeeting)
  .patch("/detail/:id", deleteActa)
  .post("/:id/upload-acta", upload.single("acta"), subirActaReunion);

export default router;
