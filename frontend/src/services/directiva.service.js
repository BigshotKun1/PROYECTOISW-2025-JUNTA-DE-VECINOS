import axios from "./root.service.js";
import { formatDirectivaData } from "@helpers/formatData.js";

export const getAllDirectiva = async () => {
  try {
    const { data } = await axios.get("/directiva/");
    const formattedData = data.data.map(formatDirectivaData);
    console.log("Directiva data:", formattedData);
    return formattedData;
  } catch (error) {
    return error.response.data;
  }
};

export const createDirectiva = async (directiva) => {
  try {
    const response = await axios.post("/directiva/crear", directiva);
    return response.data;
  } catch (error) {
    console.error("Error al crear directiva:", error);
    return error.response.data;
  }
};

export const getPeriodos = async () => {
  try {
    const { data } = await axios.get("/directiva/periodos");
    console.log("PERIODOS DATA:", data);
    return data;
  } catch (error) {
    return error.response.data;
  }
};
