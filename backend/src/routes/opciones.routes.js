import express from "express";
import { createOpcionVoto, getOpcionesByVotacion } from "../controllers/opcionesvoto.controller.js";
const router = express.Router();

router.post("/", createOpcionVoto);
router.get("/:id_votacion", getOpcionesByVotacion);

export default router;