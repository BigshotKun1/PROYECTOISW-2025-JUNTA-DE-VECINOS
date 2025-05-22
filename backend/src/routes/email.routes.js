import express from "express";
import { sendEmail } from "../controllers/email.controller.js";


const router = express.Router();
// Route to send an email
router.post("/send", sendEmail);

export default router;