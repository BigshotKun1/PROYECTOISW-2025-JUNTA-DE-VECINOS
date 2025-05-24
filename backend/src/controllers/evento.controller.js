"use strict";
import {
  createEventoService,
  getAllEventosService,
} from "../services/evento.service.js";
import {
  eventoValidation,
} from "../validations/evento.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

// Crear evento (solo directiva)
export async function createEvento(req, res) {
  try {
    const { body } = req;
    const { error } = eventoValidation.validate(body);
    if (error) {
      return handleErrorClient(res, 400, "Error de validación", error.message);
    }

    const id_usuario = req.user.id_usuario; // asumimos que el token ya fue validado y el usuario inyectado por middleware

    const [nuevoEvento, errorEvento] = await createEventoService({ ...body, id_usuario });
    if (errorEvento) {
      return handleErrorClient(res, 400, "Error al crear evento", errorEvento);
    }

    handleSuccess(res, 201, "Evento creado con éxito", nuevoEvento);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Obtener todos los eventos (todos los usuarios)
export async function getAllEventos(req, res) {
  try {
    const [eventos, errorEventos] = await getAllEventosService();
    if (errorEventos) {
      return handleErrorClient(res, 400, "Error al obtener eventos", errorEventos);
    }

    handleSuccess(res, 200, "Eventos obtenidos con éxito", eventos);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
