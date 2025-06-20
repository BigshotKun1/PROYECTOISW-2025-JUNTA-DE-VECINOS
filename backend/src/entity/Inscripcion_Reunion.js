"use strict";
import { EntitySchema } from "typeorm";

const Inscripcion_ReunionSchema = new EntitySchema({
  name: "Inscripcion_Reunion",
  tableName: "inscripcion_reunion",
  columns: {
    id_inscripcion_reunion: {
      type: "int",
      primary: true,
      generated: true,
    },
    id_usuario: {
      type: "int",
      nullable: false,
    },
    id_reunion: {
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
    id_reunion: {
      target: "Reunion",
      type: "many-to-one",
      joinColumn: {
        name: "id_reunion",
        referencedColumnName: "id_reunion",
      },
    },
    asistencia_reunion: {
      target: "Asistencia_Reunion",
      type: "one-to-many",
      inverseSide: "id_inscripcion_reunion",
    },
  },
  indices: [
    {
      name: "IDX_INSCRIPCION_REUNION",
      columns: ["id_inscripcion_reunion"],
      unique: true,
    },
    {
      name: "IDX_INSCRIPCION_REUNION_ID_USUARIO",
      columns: ["id_usuario"],
      unique: false,
    },
    {
      name: "IDX_INSCRIPCION_REUNION_ID_REUNION",
      columns: ["id_reunion"],
      unique: false,
    },
  ],
    uniques: [{
    name : "unique_id_reunion_id_estado",
    columns: ["id_reunion","id_usuario"]
  }]
});

export default Inscripcion_ReunionSchema;
