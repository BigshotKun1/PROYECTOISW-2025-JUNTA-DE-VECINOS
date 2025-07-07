"use strict"
import Joi from "joi";

export const asistenciaBodyValidation = Joi.object({
    id_estado_asistencia:Joi.number()
        .integer()
        .positive()
        .messages({
            "number.base": "El id del estado debe ser un número.",
            "number.integer": "El id del estado debe ser un número entero.",
            "number.positive": "El id del estado debe ser un número positivo.",
        })
})


export const asistenciaParamsValidation = Joi.object({
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