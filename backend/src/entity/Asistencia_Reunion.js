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
    }
  },
  relations: {
    id_usuario: {
      target: "User",
      type: "many-to-one",
      inverseSide: "asistencias", 
      joinColumn: {
        name: "id_usuario",
        referencedColumnName: "id_usuario",
      },
      nullable: false
    },
    id_reunion: {
      target: "Reunion",
      type: "many-to-one",
      joinColumn: {
        name: "id_reunion",
        referencedColumnName: "id_reunion",
      },
      nullable: false
    },
    id_estado_asistencia: {
      target: "EstadoAsistencia",
      type: "many-to-one",
      joinColumn: {
        name: "id_estado_asistencia",
        referencedColumnName: "id_estado_asistencia",
      },
      nullable: false
    },
  },
  indices: [
    {
      name: "IDX_ASISTENCIA_REUNION",
      columns: ["id_asistencia_reunion"],
      unique: true,
    },
    {
      name: "IDX_ASISTENCIA_REUNION_ID_ESTADO",
      columns: ["id_estado_asistencia"],
      unique: false,
    },
  ],
  uniques: [
    {
      name: "unique_id_reunion_id_usuario",
      columns: ["id_reunion", "id_usuario"]
    }
  ]
});

export default Asistencia_ReunionSchema;
