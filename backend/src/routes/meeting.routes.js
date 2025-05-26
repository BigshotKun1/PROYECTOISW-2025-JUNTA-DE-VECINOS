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

const router = Router();

router
    .get("/all", getMeetings)

router 
    .use(authenticateJwt)
    .use(isAdminyDirectiva)
router
    .get("/:id", getMeeting)
    .patch("/:id", updateMeeting)
    .delete("/:id", deleteMeeting)
    .post("/", createMeeting);

export default router;