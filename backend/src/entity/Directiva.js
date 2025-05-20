"use strict";
import { EntitySchema } from "typeorm";

const DirectivaSchema = new EntitySchema({
  name: "Directiva",
  tableName: "directivas",
  columns: {
    id_directiva: {
      type: "int",
      primary: true,
      generated: true,
    },
    FechaInicio: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      nullable: false,
    },
    FechaTermino: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      nullable: false,
    },
  },
  relations: {
    usuario: {
      target: "User",
      type: "many-to-one",
      joinColumn: {
        name: "id_usuario",
        referencedColumnName: "id_usuario",
      },
    },
    rol: {
      target: "Rol",
      type: "many-to-one",
      joinColumn: {
        name: "id_rol",
        referencedColumnName: "id_rol",
        },
    },
    id_votacion: {
    target: "Votaciones",
    type: "one-to-many",
    inverseSide: "id_directiva",
    joinColumn: {
        name: "id_directiva",
        referencedColumnName: "id_directiva",
        },
    },
    eventos: {
      target: "Evento",
      type: "one-to-many",
      inverseSide: "directiva",
    },
    reuniones: {
      target: "Reunion",
      type: "one-to-many",
      inverseSide: "directiva",
    },
  },
  indices: [
    {
      name: "IDX_DIRECTIVA",
      columns: ["id_directiva"],
      unique: true,
    },
    {
      name: "IDX_DIRECTIVA_FECHA_INICIO",
      columns: ["FechaInicio"],
    },
    {
      name: "IDX_DIRECTIVA_FECHA_TERMINO",
      columns: ["FechaTermino"],
    },
  ],
});

export default DirectivaSchema;
