"use strict"
import Joi from "joi";

export const asistenciaBodyValidation = Joi.object({
    id: Joi.number()
        .integer()
        .positive()
        .messages({
            "number.base": "El id de la inscripcion debe ser un número.",
            "number.integer": "El id de la inscripcion debe ser un número entero.",
            "number.positive": "El id de la inscripcion debe ser un número positivo.",
    }),
    id_estado:Joi.number()
    .integer()
        .positive()
        .messages({
            "number.base": "El id de la inscripcion debe ser un número.",
            "number.integer": "El id de la inscripcion debe ser un número entero.",
            "number.positive": "El id de la inscripcion debe ser un número positivo.",
        })
})