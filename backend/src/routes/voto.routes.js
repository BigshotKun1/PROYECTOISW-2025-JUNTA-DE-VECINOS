import express from 'express';
import { authenticateJwt } from '../middlewares/authentication.middleware.js';
import { emitirVoto, listarVotos} from '../controllers/voto.controller.js';

const router = express.Router();

router.post('/', authenticateJwt, emitirVoto);
router.get('/', authenticateJwt, listarVotos);

export default router;