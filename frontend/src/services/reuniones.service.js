import axios from "./root.service.js";

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
      return [response.data.data, null];
    } else {
      console.warn("La respuesta no contiene datos esperados:", response);
      return [null, "Respuesta vacía o inesperada"];
    }
  } catch (error) {
    console.error("Error al eliminar la reunión:", error);
    return [
      null,
      error?.response?.data?.message || error.message || "Error desconocido",
    ];
  }
}
export async function getAllReuniones() {
  try {
    const response = await axios.get("meetings/all");

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
    const response = await axios.post("meetings/", reunion);
    return [response.data, null];
  } catch (error) {
    //const mensajeError = error?.response?.details || error?.response?.message;
    const mensajeError =
      error?.response?.data?.details || error?.response?.data?.message;
    return [
      null,
      { message: mensajeError || "Error al crear reunión", fullError: error },
    ];
  }
}

export async function uploadActaToMeeting(id, file) {
  try {
    const formData = new FormData();
    formData.append("acta", file);

    const response = await axios.post(`meetings/${id}/upload-acta`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return [response.data, null];
  } catch (error) {
    console.error("Error al subir el acta:", error);
    return [null, error];
  }
}

export async function updateReunion(id, reunionActualizada) {
  try {
    const res = await axios.patch(`meetings/${id}`, reunionActualizada);
    return [res.data, null];
  } catch (err) {
    console.error("Error actualizando estado de la reunión:", err);
    return [null, err];
  }
}
