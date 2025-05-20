"use strict"; 
import { EntitySchema } from "typeorm";

const RolSchema = new EntitySchema({
  name: "Rol",
  tableName: "roles",
  columns: {
    id_rol: {
      type: "int",
      primary: true,
      generated: true,
    },
    nombreRol: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    createdAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      nullable: false,
    },
    updatedAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: "CURRENT_TIMESTAMP",
      nullable: false,
    },
  },

  relations: {
    users: {
      target: "User",
      type: "one-to-many",
      inverseSide: "rol",
    },
    directivas: {
      target: "Directiva",
      type: "one-to-many",
      inverseSide: "rol",
    },
  },

  indices: [
    {
      name: "IDX_ROL",
      columns: ["id_rol"],
      unique: true,
    },
    {
      name: "IDX_ROL_NOMBRE",
      columns: ["nombreRol"],
      unique: true,
    },
  ],
});

export default RolSchema;
