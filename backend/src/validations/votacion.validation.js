import Joi from "joi";

export const votacionCreacionValidation = Joi.object({
  titulo_votacion: Joi.string().max(255).required(),
  descripcion_votacion: Joi.string().max(1024).required(),
  fecha_votacion: Joi.date().iso().required(),
  hora_inicio: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
  hora_termino: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
}); 