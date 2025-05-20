"use strict";
import { EntitySchema } from "typeorm";

const VotacionesSchema = new EntitySchema({
  name: "Votaciones",
  tableName: "votaciones",
  columns: {
    id_votacion: {
      type: "int",
      primary: true,
      generated: true,
    },
    hora_inicio: {
      type: "time",
      nullable: false,
    },
    hora_termino: {
      type: "time",
      nullable: false,
    },
    motivo_votacion: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    id_usuario: {
      type: "int",
      nullable: false,
    },
    voto: {
      type: "int",
      nullable: false,
    },
    id_directiva: {
      type: "int",
      nullable: false,
    },
  },
  relations: {
    id_usuario: {
      target: "User",
      type: "many-to-one",
      joinColumn: {
        name: "id_usuario",
        referencedColumnName: "id_usuario",
      },
    },
    id_directiva: {
      target: "Directiva",
      type: "many-to-one",
      joinColumn: {
        name: "id_directiva",
        referencedColumnName: "id_directiva",
      },
    },
  },
  indices: [
    {
      name: "IDX_VOTACIONES",
      columns: ["id_votacion"],
      unique: true,
    },
    {
      name: "IDX_VOTACIONES_HORA_INICIO",
      columns: ["hora_inicio"],
      unique: false,
    },
    {
      name: "IDX_VOTACIONES_HORA_TERMINO",
      columns: ["hora_termino"],
      unique: false,
    },
  ],
});

export default VotacionesSchema;
