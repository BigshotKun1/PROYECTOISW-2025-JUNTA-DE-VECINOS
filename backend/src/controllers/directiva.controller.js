import { createDirectivaService } from "../services/directiva.service.js";
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
