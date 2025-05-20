"use strict";
import { EntitySchema } from "typeorm";

const EstadoSchema = new EntitySchema({
  name: "Estado",
  tableName: "estados",
  columns: {
    id_estado: {
      type: "int",
      primary: true,
      generated: true,
    },
    nombreEstado: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
  },
  relations: {
    reuniones: {
      target: "Reunion",
      type: "one-to-many",
      inverseSide: "estado", // debe coincidir con el nombre usado en ReunionSchema
    },
    asistencias: {
      target: "Asistencia_Reunion",
      type: "one-to-many",
      inverseSide: "estado", // debe coincidir con el nombre usado en Asistencia_ReunionSchema
    },
  },
  indices: [
    {
      name: "IDX_ESTADOS",
      columns: ["id_estado"],
      unique: true,
    },
    {
      name: "IDX_ESTADOS_NOMBRE",
      columns: ["nombreEstado"],
      unique: false,
    },
  ],
});

export default EstadoSchema;
