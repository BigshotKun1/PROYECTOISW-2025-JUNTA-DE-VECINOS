import axios from './root.service.js';

export async function getVotaciones() {
  const res = await axios.get('/votaciones');
  return res.data.votaciones.sort(
    (a, b) => new Date(b.fecha_votacion) - new Date(a.fecha_votacion)
  );
}