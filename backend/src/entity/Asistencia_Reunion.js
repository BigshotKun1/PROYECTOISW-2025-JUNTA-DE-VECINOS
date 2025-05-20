"use strict";
import { EntitySchema } from "typeorm";

const Asistencia_ReunionSchema = new EntitySchema({
  name: "Asistencia_Reunion",
  tableName: "asistencia_reunion",
  columns: {
    id_asistencia_reunion: {
      type: "int",
      primary: true,
      generated: true,
    },
    id_inscripcion_reunion: {
      type: "int",
      nullable: false,
    },
    id_estado: {
      type: "int",
      nullable: false,
    },
  },
  relations: {
    id_inscripcion_reunion: {
      target: "Inscripcion_Reunion",
      type: "many-to-one",
      joinColumn: {
        name: "id_inscripcion_reunion",
        referencedColumnName: "id_inscripcion_reunion",
      },
    },
    id_estado: {
      target: "Estado",
      type: "many-to-one",
      joinColumn: {
        name: "id_estado",
        referencedColumnName: "id_estado",
      },
    },
  },
  indices: [
    {
      name: "IDX_ASISTENCIA_REUNION",
      columns: ["id_asistencia_reunion"],
      unique: true,
    },
    {
      name: "IDX_ASISTENCIA_REUNION_ID_INSCRIPCION_REUNION",
      columns: ["id_inscripcion_reunion"],
      unique: false,
    },
    {
      name: "IDX_ASISTENCIA_REUNION_ID_ESTADO",
      columns: ["id_estado"],
      unique: false,
    },
  ],
});

export default Asistencia_ReunionSchema;
