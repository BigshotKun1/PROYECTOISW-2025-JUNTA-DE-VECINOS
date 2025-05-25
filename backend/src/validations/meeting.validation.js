"use strict"
import Joi from "joi";

const maxDate = new Date()
maxDate.setMonth(maxDate.getMonth()+6)
/*
const compareHours = (value,helper)=>{
    const [h1,m1] = value.hora_inicio.split(":").map(Number);
    const [h2,m2] = value.hora_termino.split(":").map(Number);

    const inicio = h1 + m1;
    const termino = h2 + m2;

    if(termino <= inicio ){
        return helper.message(
            "La hora termino de la reunion tiene que ser distinta y mayor a la hora de inicio. "
        )
    }
    return value;
}
const hourValidator = (value,helper)=>{
    const [h1,m1] = value.hora_inicio.split(":").map(Number);
    const [h2,m2] = value.hora_termino.split(":").map(Number);
    if(h1 < 11 || h1 < 11 ){
        if(h1.toString() !== "08" || h1.toString() !== "09"||h1.toString() !== "10" 
        || h2.toString() !== "08" || h2.toString() !== "09"||h2.toString() !== "10"){
            return helper.message(
                "No puedes agendar horas antes de las 08:00 AM. "
            ) 
        }
    }

    return value;
}
    */
export const meetingBodyValidation = Joi.object({
    fecha_reunion: Joi.date()
        .greater("now")
        .less(maxDate)
        .required()
        .messages({
            "date.greater":"La fecha tiene que ser futura. ",
            "date.less":"La fecha no puede ser superior a 6 meses. ",
            "any.required":"La fecha es obligatoria. ",
        }),
    lugar_reunion: Joi.string()
        .required()
        .max(40)
        .min(5)
        .messages({
            "any.required":"El lugar de la reunion es obligatorio.",
            "string.max":"El lugar de la reunion no puede superar los 40 caracteres",
            "string.min":"El lugar de la reunion tiene que tener como minimo 5 caracteres",
            "string.base":"El lugar de la reunion debe ser de tipo string"
        }),
    hora_inicio: Joi.string()
        .required()
        .pattern(/^([01]\d|2[0-1]):([0-5]\d)$/)
        .messages({
            "any.required":"La hora de inicio de reunion es obligatoria",
            "string.base":"La hora de inicio de la reunion debe ser de tipo string",
            "string.pattern":"La fecha tiene que tener formato HH:MM y solo se pueden agendar horas antes de las 22:00."
        }),
    hora_termino: Joi.string()
        .required()
        .pattern(/^([01]\d|2[0-1]):([0-5]\d)$/)
        .messages({
            "any.required":"La hora de termino de reunion es obligatoria",
            "string.base":"La hora de termino de la reunion debe ser de tipo string",
            "string.pattern":"La fecha tiene que tener formato HH:MM y solo se pueden agendar horas antes de las 22:00."
        }),
    id_estado: Joi.number()
        .integer()
        .positive()
        .messages({
            "number.base": "El id del estado debe ser un número.",
            "number.integer": "El id del estado debe ser un número entero.",
            "number.positive": "El id del estado debe ser un número positivo.",
    }),
        
}).custom((value, helpers) => {
    // Validación cruzada
    const [h1, m1] = value.hora_inicio.split(":").map(Number);
    const [h2, m2] = value.hora_termino.split(":").map(Number);

    const inicio = h1 * 60 + m1;
    const termino = h2 * 60 + m2;

    if (termino <= inicio) {
        return helpers.message("La hora de término debe ser mayor a la hora de inicio.");
    }

    if (h1 < 8 || h2 < 8) {
        return helpers.message("No puedes agendar horas antes de las 08:00.");
    }

    return value;
}, "Validación cruzada de horas");

//.custom((compareHours, "Validacion para que las horas no estén cruzadas"))
//.custom((hourValidator, "Validacion para que las horas no sean antes de las 08:00 am"))
/*
export const meetingQueryValidation = Joi.object({
    id_reunion: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
        "number.base": "El id debe ser un número.",
        "number.integer": "El id debe ser un número entero.",
        "number.positive": "El id debe ser un número positivo.",
        "any.required": "El id es obligatorio para buscar una reunion.",
    }),
})
*/