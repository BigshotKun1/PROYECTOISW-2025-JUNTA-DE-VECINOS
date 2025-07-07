import Joi from "joi";

export const eventoValidation = Joi.object({
  nombreEvento: Joi.string().max(255).required(),
  fechaEvento: Joi.date().required(),
  lugar_evento: Joi.string().max(255).required(),
  hora_inicio: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
  hora_termino: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
});

