import axios from "./root.service.js";

export async function getAsistenciasByReunion(idReunion) {
  try {
    const res = await axios.get(`/asistencias/${idReunion}`);
    return res.data.data || [];
  } catch (err) {
    console.error("Error obteniendo asistencias:", err);
    return [];
  }
}

export async function updateAsistenciaEstado(idAsistencia, estadoNuevo) {
  try {
    const res = await axios.patch(`/asistencias/${idAsistencia}`, {
      id_estado_asistencia: parseInt(estadoNuevo),
    });
    return [res.data, null];
  } catch (err) {
    console.error("Error actualizando estado:", err);
    return [null, err];
  }
}

export async function getEstadisticasAsistencia() {
  try {
    const res = await axios.get(`/asistencias/estadisticas-asistencia`);
    console.log("res.data", res.data);
    if (res?.data) {
      return res.data;
    } else {
      console.warn("La respuesta no contiene datos esperados:", res);
      return [];
    }
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    return [];
  }
}

export async function getHistorial(rutU) {
  try {
    const res = await axios.get(`/asistencias/historial-asistencias/${rutU}`);
    console.log("res.data", res.data);
    if (res?.data) {
      return res.data;
    } else {
      console.warn("La respuesta no contiene datos esperados:", res);
      return [];
    }
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    return [];
  }
}
