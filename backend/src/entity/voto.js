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
    id_opcion_voto: {
      type: "int",
      nullable: false,
    },
    id_votacion: {
      type: "int",
      nullable: false,
    },
    fecha: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
  },
  relations: {
    opcionVoto: {
      target: "OpcionesVoto",
      type: "many-to-one",
      joinColumn: {
        name: "id_opcion_voto",
        referencedColumnName: "id_opcion_voto",
      },
    },
    votacion: {
      target: "Votaciones",
      type: "many-to-one",
      joinColumn: {
        name: "id_votacion",
        referencedColumnName: "id_votacion",
      },
    },
  },
});

export default Voto;