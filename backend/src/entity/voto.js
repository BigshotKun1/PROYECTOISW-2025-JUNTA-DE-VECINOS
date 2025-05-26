"use strict";
import { EntitySchema } from "typeorm";

const VotoSchema = new EntitySchema({
  name: "Voto",
  tableName: "votos",
  columns: {
    id_voto: {
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
    voto: {
      type: "boolean",
      nullable: false,
    },
  },
  relations: {
    votacion: {
      target: "Votacion",
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