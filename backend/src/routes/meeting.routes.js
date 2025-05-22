"use strict";
import { Router } from "express";
//import { isAdmin } from "../middlewares/authorization.middleware.js"; ->  (idPresident, isSecretary, isTreasurer)
//import { authenticateJwt } from "../middlewares/authentication.middleware.js";
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
    .get("/id", getMeeting)
    .patch("/id", updateMeeting)
    .delete("/id", deleteMeeting)
    .post("/", createMeeting);

export default router;