"use strict";
import { EntitySchema } from "typeorm";

const ReunionSchema = new EntitySchema({
  name: "Reunion",
  tableName: "reuniones",
  columns: {
    id_reunion: {
      type: "int",
      primary: true,
      generated: true,
    },
    fecha_reunion: {
      type: "date",
      nullable: false,
      default: () => "CURRENT_DATE",
    },
    descripcion_reunion: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    lugar_reunion: {
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
    acta_pdf: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
  },
  relations: {
    periodo: {
      target: "DirectivaPeriodo",
      type: "many-to-one",
      joinColumn: { name: "id_periodo", referencedColumnName: "id_periodo" },
    },
    estado: {
      target: "Estado",
      type: "many-to-one",
      inverseSide: "reuniones",
      joinColumn: {
        name: "id_estado",
        referencedColumnName: "id_estado",
      },
    },
    votaciones: {
      target: "Votaciones",
      type: "one-to-many",
      inverseSide: "reuniones",
      joinColumn: {
        name: "id_votacion",
        referencedColumnName: "id_votacion",
      },
    },
  },
  indices: [
    {
      name: "IDX_REUNION",
      columns: ["id_reunion"],
      unique: true,
    },
    {
      name: "IDX_REUNION_FECHA",
      columns: ["fecha_reunion"],
    },
    {
      name: "IDX_REUNION_LUGAR",
      columns: ["lugar_reunion"],
    },
  ],
  uniques: [
    {
      name: "unique_fecha_lugar_horaInicio_horaTermino",
      columns: [
        "fecha_reunion",
        "hora_inicio",
        "hora_termino",
        "lugar_reunion",
      ],
    },
  ],
});

export default ReunionSchema;
