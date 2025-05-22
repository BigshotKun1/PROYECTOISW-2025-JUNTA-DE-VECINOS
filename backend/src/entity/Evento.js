"use strict";
import { EntitySchema } from "typeorm";

const EventoSchema = new EntitySchema({
  name: "Evento",
  tableName: "eventos",
  columns: {
    id_evento: {
      type: "int",
      primary: true,
      generated: true,
    },
    nombreEvento: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    fechaEvento: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      nullable: false,
    },
    lugar_evento: {
      type: "varchar",
      length: 255,
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
    joinColumn: { name: "id_periodo", referencedColumnName: "id_periodo" },
  },
  },
  indices: [
    {
      name: "IDX_EVENTO",
      columns: ["id_evento"],
      unique: true,
    },
    {
      name: "IDX_EVENTO_NOMBRE",
      columns: ["nombreEvento"],
    },
    {
      name: "IDX_EVENTO_FECHA",
      columns: ["fechaEvento"],
    },
    {
      name: "IDX_EVENTO_LUGAR",
      columns: ["lugar_evento"],
    },
    {
      name: "IDX_EVENTO_HORA_INICIO",
      columns: ["hora_inicio"],
    },
    {
      name: "IDX_EVENTO_HORA_TERMINO",
      columns: ["hora_termino"],
    },
  ],
});

export default EventoSchema;
