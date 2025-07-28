import axios from './root.service.js';

export async function getVotaciones() {
  try {
    const response = await axios.get('/votaciones');
    // El backend responde { message, votaciones }
    return response.data.votaciones;
  } catch (error) {
    console.error("Error al obtener votaciones:", error);
    throw new Error('Error al obtener votaciones');
  }
}

export async function crearVotacion(data) {
  try {
    // Elimina id_usuario del payload
    const response = await axios.post('/votaciones', data);
    return response.data;
  } catch (error) {
    console.error('Error al crear la votación:', error);
    throw new Error('Error al crear la votación');
  }
}

export async function eliminarVotacion(id_votacion) {
  try {
    const response = await axios.delete(`/votaciones/${id_votacion}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar la votación:', error);
    throw new Error('Error al eliminar la votación');
  }
}

export async function emitirVoto(id_votacion, opcion_index) {
  try {
    const response = await axios.post('/votos', { id_votacion, opcion_index });
    return response.data;
  } catch (error) {
    console.error('Error al emitir voto:', error);
    throw new Error('Error al emitir voto');
  }
}

export async function verificarUsuarioYaVoto(id_votacion, id_usuario) {
  try {
    const response = await axios.get(`/votos/ya-voto/${id_votacion}/${id_usuario}`);
    return response.data.yaVoto;
  } catch (error) {
    console.error('Error al verificar si el usuario ya votó:', error);
    return false;
  }
}