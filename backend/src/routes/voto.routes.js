import express from 'express';
import { authenticateJwt } from '../middlewares/authentication.middleware.js';
import { emitirVoto, listarVotos, listarVotosPorVotacion} from '../controllers/voto.controller.js';

const router = express.Router();

router.post('/', authenticateJwt, emitirVoto);
router.get('/', authenticateJwt, listarVotos);
router.get('/votacion/:id_votacion', authenticateJwt, listarVotosPorVotacion);

export default router;