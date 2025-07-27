"use strict";
import { EntitySchema } from "typeorm";

const UserSchema = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id_usuario: {
      type: "int",
      primary: true,
      generated: true,
    },
    nombreCompleto: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    rut: {
      type: "varchar",
      length: 12,
      nullable: false,
      unique: true,
    },
    email: {
      type: "varchar",
      length: 255,
      nullable: false,
      unique: true,
    },
    certificadoResidencia_pdf: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    password: {
      type: "varchar",
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
    id_rol: {
      type: "int",
      nullable: false,
    },
  },
  indices: [
    {
      name: "IDX_USER",
      columns: ["id_usuario"],
      unique: true,
    },
    {
      name: "IDX_USER_RUT",
      columns: ["rut"],
      unique: true,
    },
    {
      name: "IDX_USER_EMAIL",
      columns: ["email"],
      unique: true,
    },
  ],
  relations: {
    asistencias: {
      target: "Asistencia_Reunion",
      type: "one-to-many",
      inverseSide: "id_usuario",
    },
    votaciones: {
      target: "Votaciones",
      type: "one-to-many",
      inverseSide: "id_usuario", // corresponde al campo many-to-one en Votaciones
    },
    rol: {
      target: "Rol",
      type: "many-to-one",
      joinColumn: {
        name: "id_rol",
        referencedColumnName: "id_rol",
      },
      nullable: false,
    },
  },
});

export default UserSchema;
