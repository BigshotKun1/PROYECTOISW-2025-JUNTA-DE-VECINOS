"use strict";
import {
  createEventoService,
  getAllEventosService,
  deleteEventoService,
  updateEventoService,
} from "../services/evento.service.js";
import { eventoValidation } from "../validations/evento.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";
import {
  notifyVecinosEvento,
  notifyVecinosEventoActualizado,
  notifyVecinosEventoEliminado,
} from "../services/email.service.js";
import DirectivaMiembro from "../entity/DirectivaMiembros.js";
import { AppDataSource } from "../config/configDb.js";

// Crear evento (solo directiva)
export async function createEvento(req, res) {
  try {
    const { body } = req;
    const { error } = eventoValidation.validate(body);
    const miembroRepo = AppDataSource.getRepository(DirectivaMiembro);

    if (error) {
      return handleErrorClient(res, 400, "Error de validación", error.message);
    }

    const id_usuario = req.user.id_usuario;

    const [nuevoEvento, errorEvento] = await createEventoService({
      ...body,
      id_usuario,
    });
    if (errorEvento) {
      console.error("Error al crear evento:", errorEvento);
      return handleErrorClient(res, 400, "Error al crear evento", errorEvento);
    }

    handleSuccess(res, 201, "Evento creado con éxito", nuevoEvento);
    await notifyVecinosEvento(nuevoEvento);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Obtener todos los eventos (todos los usuarios)
export async function getAllEventos(req, res) {
  try {
    const [eventos, errorEventos] = await getAllEventosService();
    if (errorEventos) {
      return handleErrorClient(
        res,
        400,
        "Error al obtener eventos",
        errorEventos,
      );
    }

    handleSuccess(res, 200, "Eventos obtenidos con éxito", eventos);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function deleteEvento(req, res) {
  try {
    const { id_evento } = req.params;
    if (!id_evento) {
      return handleErrorClient(res, 400, "ID de evento requerido");
    }

    const [eventoEliminado, errorEvento] = await deleteEventoService({
      id_evento,
    });
    if (errorEvento) {
      return handleErrorClient(
        res,
        400,
        "Error al eliminar evento",
        errorEvento,
      );
    }

    handleSuccess(res, 200, "Evento eliminado con éxito", eventoEliminado);
    await notifyVecinosEventoEliminado(eventoEliminado);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function updateEvento(req, res) {
  try {
    const { id_evento } = req.params;
    const { body } = req;

    if (!id_evento) {
      return handleErrorClient(res, 400, "ID de evento requerido");
    }

    const [eventoActualizado, errorEvento] = await updateEventoService({
      id_evento,
      ...body,
    });
    if (errorEvento) {
      return handleErrorClient(
        res,
        400,
        "Error al actualizar evento",
        errorEvento,
      );
    }

    handleSuccess(res, 200, "Evento actualizado con éxito", eventoActualizado);
    await notifyVecinosEventoActualizado(eventoActualizado);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
