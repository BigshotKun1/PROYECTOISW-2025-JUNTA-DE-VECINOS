import { createDirectivaService, getDirectivaService, deleteDirectivaService } from "../services/directiva.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import Joi from "joi";

const directivaValidation = Joi.object({
  id_usuario: Joi.number().integer().required(),
  id_rol: Joi.number().integer().required(),
  fechaInicio: Joi.date().required(),
  fechaTermino: Joi.date().required(),
});

export async function createDirectiva(req, res) {
  try {
    const { error: validationError } = directivaValidation.validate(req.body);
    if (validationError) return handleErrorClient(res, 400, validationError.message);

    const { id_usuario, id_rol, fechaInicio, fechaTermino } = req.body;

    const [miembro, error] = await createDirectivaService({ id_usuario, id_rol, fechaInicio, fechaTermino });

    if (error) return handleErrorClient(res, 400, error);

    return handleSuccess(res, 201, "Miembro de directiva creado correctamente", miembro);
  } catch (error) {
    return handleErrorServer(res, 500, error.message);
  }
}

export async function getDirectiva(req, res) {
  try {
    const [directiva, error] = await getDirectivaService();

    if (error) return handleErrorClient(res, 400, error);

    return handleSuccess(res, 200, "Directiva obtenida correctamente", directiva);
  } catch (error) {
    return handleErrorServer(res, 500, error.message);
  }
}

export async function getDirectivaByPeriodo(req, res) {
  try {
    const { id_periodo } = req.params;

    if (!id_periodo) return handleErrorClient(res, 400, "ID de periodo es requerido");

    const [directiva, error] = await getDirectivaService(id_periodo);

    if (error) return handleErrorClient(res, 400, error);

    return handleSuccess(res, 200, "Directiva obtenida correctamente", directiva);
  } catch (error) {
    return handleErrorServer(res, 500, error.message);
  }
}

export async function getDirectivaByUser(req, res) {
  try {
    const { id_usuario } = req.params;

    if (!id_usuario) return handleErrorClient(res, 400, "ID de usuario es requerido");

    const [directiva, error] = await getDirectivaService(id_usuario);

    if (error) return handleErrorClient(res, 400, error);

    return handleSuccess(res, 200, "Directiva obtenida correctamente", directiva);
  } catch (error) {
    return handleErrorServer(res, 500, error.message);
  }
}

export async function deleteDirectiva(req, res) {
  try {
    const { id_usuario, id_periodo } = req.params;

    if (!id_usuario || !id_periodo) {
      return handleErrorClient(res, 400, "ID de usuario y periodo son requeridos");
    }

    const [resultado, error] = await deleteDirectivaService({ id_usuario, id_periodo });

    if (error) {
      return handleErrorClient(res, 404, error);
    }

    return handleSuccess(res, 200, "Miembro de directiva eliminado correctamente", resultado);
  } catch (error) {
    return handleErrorServer(res, 500, error.message);
  }
}