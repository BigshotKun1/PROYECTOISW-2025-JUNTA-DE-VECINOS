"use strict";
import Joi from "joi";

const hoy = new Date();
const hoyUTC = new Date(
  hoy.getFullYear(),
  hoy.getMonth(),
  hoy.getDate(),
  hoy.getHours(),
  hoy.getMinutes(),
);
console.log("hoyUTC antes del sethour:", hoyUTC);
console.log("hoy antes del sethour:", hoy);
hoy.setHours(0, 0, 0, 0);
console.log("hoy despues del sethour:", hoy);
const maxDate = new Date();
maxDate.setMonth(maxDate.getMonth() + 6);
export const meetingBodyValidation = Joi.object({
  fecha_reunion: Joi.date().min(hoy).less(maxDate).required().messages({
    "date.min": "No puedes agendar una reunión para hoy.",
    "date.less": "La fecha no puede ser superior a 6 meses. ",
    "any.required": "La fecha es obligatoria. ",
  }),
  lugar_reunion: Joi.string().required().max(40).min(5).messages({
    "any.required": "El lugar de la reunion es obligatorio.",
    "string.max": "El lugar de la reunion no puede superar los 40 caracteres",
    "string.min":
      "El lugar de la reunion tiene que tener como minimo 5 caracteres",
    "string.base": "El lugar de la reunion debe ser de tipo string",
  }),
  hora_inicio: Joi.string()
    .required()
    .pattern(/^([01]\d|2[0-1]):([0-5]\d)$/)
    .messages({
      "any.required": "La hora de inicio de reunion es obligatoria",
      "string.base": "La hora de inicio de la reunion debe ser de tipo string",
      "string.pattern":
        "La fecha tiene que tener formato HH:MM y solo se pueden agendar horas antes de las 22:00.",
    }),
  hora_termino: Joi.string()
    .required()
    .pattern(/^([01]\d|2[0-1]):([0-5]\d)$/)
    .messages({
      "any.required": "La hora de termino de reunion es obligatoria",
      "string.base": "La hora de termino de la reunion debe ser de tipo string",
      "string.pattern":
        "La fecha tiene que tener formato HH:MM y solo se pueden agendar horas antes de las 22:00.",
    }),
  id_estado: Joi.number().integer().positive().messages({
    "number.base": "El id del estado debe ser un número.",
    "number.integer": "El id del estado debe ser un número entero.",
    "number.positive": "El id del estado debe ser un número positivo.",
  }),
  descripcion_reunion: Joi.string().required().max(255).min(10).messages({
    "any.required": "La descripcion de la reunion es obligatoria.",
    "string.max":
      "La descripcion de la reunion no puede superar los 255 caracteres",
    "string.min":
      "La descripcion de la reunion tiene que tener como minimo 10 caracteres",
    "string.base": "La descripcion de la reunion debe ser de tipo string",
  }),
}).custom((value, helpers) => {
  // Validamos que la hora de termino sea despúes de la hora de inicio
  const [h1, m1] = value.hora_inicio.split(":").map(Number);
  const [h2, m2] = value.hora_termino.split(":").map(Number);

  const inicio = h1 * 60 + m1;
  const termino = h2 * 60 + m2;

  if (termino <= inicio) {
    return helpers.message(
      "La hora de término debe ser mayor a la hora de inicio.",
    );
  }

  if (h1 < 8 || h2 < 8) {
    return helpers.message("No puedes agendar horas antes de las 08:00.");
  }

  return value;
}, "Validación cruzada de horas");

export const meetingParamsValidation = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.base": "El id debe ser un número.",
    "number.integer": "El id debe ser un número entero.",
    "number.positive": "El id debe ser un número positivo.",
  }),
}).unknown(false);
