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
  fecha_votacion: {
    type: "date",
    nullable: false,
  },
  hora_inicio: {
    type: "time",
    nullable: false,
  },
  hora_termino: {
    type: "time",
    nullable: false,
  },
  titulo_votacion: {
    type: "varchar",
    length: 255,
    nullable: false,
  },
  descripcion_votacion: {
    type: "varchar",
    length: 1024,
    nullable: true,
  },
  opciones: {
  type: "simple-json", // o "json" según tu base de datos
  nullable: false,
},
  id_periodo: {
    type: "int",
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
  periodo: {
    target: "DirectivaPeriodo",
    type: "many-to-one",
    joinColumn: {
      name: "id_periodo",
      referencedColumnName: "id_periodo",
    },
  },
  votos: {
    target: "Voto",
    type: "one-to-many",
    inverseSide: "votacion",
    cascade: true,
  },
  reuniones: {
      target: "Reunion",
      type: "one-to-many",
      inverseSide: "votacion",
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
