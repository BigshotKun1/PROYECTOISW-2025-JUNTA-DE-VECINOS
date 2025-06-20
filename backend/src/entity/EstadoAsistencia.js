"use strict";
import { EntitySchema } from "typeorm";

const EstadoAsistenciaSchema = new EntitySchema({
    name: "EstadoAsistencia",
    tableName: "estadosAsistencia",
    columns: {
    id_estado_asistencia: {
        type: "int",
        primary: true,
        generated: true,
    },
    nombre_estado_asistencia: {
        type: "varchar",
        length: 255,
        nullable: false,
    },
},
    relations: {
        asistencias: {
        target: "Asistencia_Reunion",
        type: "one-to-many",
        inverseSide: "estado_asistencia", // debe coincidir con el nombre usado en Asistencia_ReunionSchema
    },
},
    indices: [
    {
        name: "IDX_ESTADOS_ASISTENCIA",
        columns: ["id_estado_asistencia"],
        unique: true,
    },
    {
        name: "IDX_ESTADOS_NOMBRE_ASISTENCIA",
        columns: ["nombre_estado_asistencia"],
        unique: false,
    },
    ],
});

export default EstadoAsistenciaSchema;
