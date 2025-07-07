import axios from './root.service.js';


export async function getMeetingById(id) {
    try {
        const response = await axios.get(`meetings/${id}`);

        if (response?.data?.data) {
            return response.data.data;
        } else {
            console.warn("La respuesta no contiene datos esperados:", response);
            return null;
        }
    } catch (error) {
        console.error("Error al obtener la reunión:", error);
        return null;
    }
}

export async function deleteMeetingById(id) {
    try {
        const response = await axios.delete(`meetings/${id}`);

        if (response?.data?.data) {
            return response.data.data;
        } else {
            console.warn("La respuesta no contiene datos esperados:", response);
            return null;
        }
    } catch (error) {
        console.error("Error al eliminar la reunión:", error);
        return null;
    }
}

export async function getAllReuniones() {
    try {
        const response = await axios.get('meetings/all');
    
        if (response?.data?.data) {
        return response.data.data;
        } else {
            console.warn("La respuesta no contiene datos esperados:", response);
            return [];
        }
    } catch (error) {
        console.error("Error al obtener las reuniones:", error);
        return [];
    }
}
export async function createReuniones(reunion) {
    try {

        const response = await axios.post('meetings/', reunion);
        return [response.data, null];
    } catch (error) {
        console.error('Error al crear reunion:', error);
        return [null, error];
    }
}
export async function updateEstadoReunion(id, nuevoEstado) {
  try {
    const reunionActual = await getMeetingById(id);

    const cuerpo = {
      fecha_reunion: reunionActual.fecha_reunion,
      descripcion: reunionActual.descripcion_reunion || reunionActual.descripcion, // por si viene como 'descripcion'
      hora_inicio: reunionActual.hora_inicio.slice(0, 5),
      hora_termino: reunionActual.hora_termino.slice(0, 5),
      lugar_reunion: reunionActual.lugar_reunion,
      id_estado: parseInt(nuevoEstado)
    };

    console.log("🟡 Enviando PATCH con:", cuerpo);

    const res = await axios.patch(`meetings/${id}`, cuerpo);
    return [res.data, null];
  } catch (err) {
    console.error("❌ Error actualizando estado de la reunión:", err.response?.data || err);
    return [null, err];
  }
}

/*
export async function updateEstadoReunion(id, reunionActualizada) {
    try {
        const res = await axios.patch(`meetings/${id}`, reunionActualizada);
        return [res.data, null];
    } catch (err) {
        console.error("Error actualizando estado de la reunión:", err);
        return [null, err];
    }
}
    */
/*
export async function updateEstadoReunion(id, reunionNueva) {
    try {
        const reunionActual = await getMeetingById(id);
        const fechaReunion = new Date(reunionActual.fecha_reunion)
            .toISOString()
            .split('T')[0]; 
        const cuerpo = {
            fecha_reunion: fechaReunion,
            descripcion_reunion: reunionActual.descripcion_reunion || reunionActual.descripcion,
            hora_inicio: reunionActual.hora_inicio.slice(0, 5),
            hora_termino: reunionActual.hora_termino.slice(0, 5),
            lugar_reunion: reunionActual.lugar_reunion,
            id_estado: reunionNueva.estado?.id_estado
        };
        console.log("ID que estoy enviando al backend:", id);
        const res = await axios.patch(`meetings/${id}`, cuerpo);
        return [res.data, null];
    } catch (err) {
        console.error("❌ Error actualizando estado de la reunión:", err.response?.data || err);
        return [null, err];
    }
}
*/