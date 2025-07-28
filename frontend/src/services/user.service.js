import axios from "./root.service.js";
import { formatUserData } from "@helpers/formatData.js";

export async function getUsers() {
  try {
    const { data } = await axios.get("/user/");
    const formattedData = data.data.map(formatUserData);
    return formattedData;
  } catch (error) {
    return error.response.data;
  }
}

export async function updateUser(data, rut) {
  try {
    const response = await axios.patch(`/user/detail/?rut=${rut}`, data);
    console.log(response);
    return response.data.data;
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
}

export async function deleteUser(rut) {
  try {
    const response = await axios.delete(`/user/detail/?rut=${rut}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function uploadCertificado(rut, file) {
  try {
    const formData = new FormData();
    formData.append("certificado", file);
    console.log(rut);
    const response = await axios.post(
      `user/${rut}/upload-certificado`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return [response.data, null];
  } catch (error) {
    console.error("Error al subir el certificado:", error);
    return [null, error];
  }
}

export async function getUser(rut) {
  try {
    const { data } = await axios.get(`/user/detail/?rut=${rut}`);
    const formattedData = data.data.map(formatUserData);
    return formattedData;
  } catch (error) {
    return error.response.data;
  }
}

export async function deleteCertificado(rut) {
  try {
    const response = await axios.patch(`/user/detail/${rut}`);
    console.log(response);
    return [response.data, null];
  } catch (error) {
    console.log(error);
    return [null, error];
  }
}

export async function crearUsuarioService(userData) {
  try {
    const response = await axios.post("/user/", userData);
    return response.data;
  } catch (error) {
    console.error("Error al crear usuario:", error);
    throw error.response.data;
  }
}
