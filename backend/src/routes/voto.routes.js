import express from 'express';
import { authenticateJwt } from '../middlewares/authentication.middleware.js';
import { emitirVoto } from '../controllers/voto.controller.js';
import { AppDataSource } from '../config/configDb.js';

const router = express.Router();

router.post('/', authenticateJwt, emitirVoto);
router.get('/', authenticateJwt, async (req, res) => {
  try {
    const votos = await AppDataSource.getRepository(voto).find();
    res.status(200).json({ message: 'Lista de votos', votos });
  } catch (error) {
    console.error('Error al obtener los votos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

export default router;