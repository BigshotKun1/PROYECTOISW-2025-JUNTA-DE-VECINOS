"use strict";
import { Router } from "express";
import { isAdminyDirectiva } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  createMeeting,
  deleteMeeting,
  getMeeting,
  getMeetings,
  updateMeeting,
} from "../controllers/meeting.controller.js";
import { upload } from "../utils/multerConfig.js";
import { subirActaReunion } from "../controllers/meeting.controller.js";

const router = Router();

router.get("/all", authenticateJwt, getMeetings);

router.use(authenticateJwt).use(isAdminyDirectiva);
router
  .get("/:id", getMeeting)
  .patch("/:id", updateMeeting)
  .delete("/:id", deleteMeeting)
  .post("/", createMeeting)
  .post("/:id/upload-acta", upload.single("acta"), subirActaReunion);

export default router;
