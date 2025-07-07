import axios from './root.service.js';


export async function getAllEventos() {
  try {
    const response = await axios.get('/eventos');
    
    if (response?.data?.data) {
      return response.data.data;
    } else {
      console.warn("La respuesta no contiene datos esperados:", response);
      return [];
    }
  } catch (error) {
    console.error("Error al obtener los eventos:", error);
    return [];
  }
}

// Crear un nuevo evento
export async function createEvento(evento) {
  try {
    // evento debe tener: nombreEvento, fechaEvento, lugar_evento, hora_inicio, hora_termino, id_usuario (según tu API)
    const response = await axios.post('/eventos/crear', evento);
    return [response.data, null];
  } catch (error) {
    console.error('Error al crear evento:', error);
    return [null, error];
  }

}

export async function deleteEvento(idEvento) {
  try {
    const response = await axios.delete(`/eventos/${idEvento}`);
    return [response.data, null];
  } catch (error) {
    console.error('Error al eliminar evento:', error);
    return [null, error];
  }

}