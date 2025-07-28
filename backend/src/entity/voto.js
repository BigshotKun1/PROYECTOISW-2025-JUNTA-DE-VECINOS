"use strict";
import { EntitySchema } from "typeorm";

const Voto = new EntitySchema({
  name: "Voto",
  tableName: "votos",
  columns: {
    id_voto: {
      type: "int",
      primary: true,
      generated: true,
    },
    id_usuario: {
      type: "int",
      nullable: false,
    },
    id_votacion: {
      type: "int",
      nullable: false,
    },
    opcion_index: { // <-- índice de la opción elegida
      type: "int",
      nullable: false,
    },
    fecha: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
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

export default Voto;