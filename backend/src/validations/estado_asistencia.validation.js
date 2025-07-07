"use strict"
import  Joi from "joi"

export const estadoAsistenciaBodyValidation  = Joi.object({
    nombre_estado_asistencia:Joi.string()
        .min(5)
        .max(20)
        .required()
        .messages({
            "any.required":"El nombre del estado es obligatorio.",
            "string.max":"El nombre del estado no puede superar los 20 caracteres",
            "string.min":"El nombre del estado tiene que tener como minimo 5 caracteres",
            "string.base":"El nombre del estado debe ser de tipo string"
        })
})

export const estadoAsistenciaParamsValidation = Joi.object({
    id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": "El id debe ser un número.",
            "number.integer": "El id debe ser un número entero.",
            "number.positive": "El id debe ser un número positivo.",
    })
}).unknown(false)