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
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      nullable: false,
    },
    lugar_reunion: {
      type: "varchar",
      length:255,
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
    directiva: {
      target: "Directiva",
      type: "many-to-one",
      joinColumn: {
        name: "id_directiva",
        referencedColumnName: "id_directiva",
      },
    },
    estado: {
      target: "Estado",
      type: "many-to-one",
      inveseSide: "reuniones",
      joinColumn: {
        name: "id_estado",
        referencedColumnName: "id_estado",
      },
    },
    inscripciones: {
      target: "Inscripcion_Reunion",
      type: "one-to-many",
      inverseSide: "reunion",
      joinColumn: {
        name: "id_reunion",
        referencedColumnName: "id_reunion",
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
});

export default ReunionSchema;
