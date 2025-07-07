"use strict";
import { EntitySchema } from "typeorm";

const OpcionesVotoSchema = new EntitySchema({
  name: "OpcionesVoto",
  tableName: "opciones_voto",
  columns: {
    id_opcion_voto: {
      type: "int",
      primary: true,
      generated: true,
    },
    id_votacion: {
      type: "int",
      nullable: false,
    },
    id_usuario: {
      type: "int",
      nullable: false,
    },
    Texto_opcion: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
  },
  relations: {
    votacion: {
      target: "Votaciones",
      type: "many-to-one",
      joinColumn: {
        name: "id_votacion",
        referencedColumnName: "id_votacion",
      },
    },
    usuario: {
      target: "User",
      type: "many-to-one",
      joinColumn: {
        name: "id_usuario",
        referencedColumnName: "id_usuario",
      },
    },
  },
});

export default OpcionesVotoSchema;