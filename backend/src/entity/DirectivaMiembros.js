import { EntitySchema } from "typeorm";

const DirectivaMiembroSchema = new EntitySchema({
  name: "DirectivaMiembro",
  tableName: "directiva_miembros",
  columns: {
    id_miembro: {
      type: "int",
      primary: true,
      generated: true,
    },
    // Defino explícitamente las columnas que participan en índices y relaciones
    id_periodo: {
      type: "int",
      nullable: false,
    },
    id_usuario: {
      type: "int",
      nullable: false,
    },
    id_rol: {
      type: "int",
      nullable: false,
    },
  },
  relations: {
    periodo: {
      target: "DirectivaPeriodo",
      type: "many-to-one",
      joinColumn: {
        name: "id_periodo",           // debe coincidir con la columna declarada arriba
        referencedColumnName: "id_periodo",
      },
      nullable: false,
      onDelete: "CASCADE",
    },
    usuario: {
      target: "User",
      type: "many-to-one",
      joinColumn: {
        name: "id_usuario",
        referencedColumnName: "id_usuario",
      },
      nullable: false,
      onDelete: "CASCADE",
    },
    rol: {
      target: "Rol",
      type: "many-to-one",
      joinColumn: {
        name: "id_rol",
        referencedColumnName: "id_rol",
      },
      nullable: false,
      onDelete: "CASCADE",
    },
  },
  indices: [
    {
      name: "IDX_DIRECTIVA_MIEMBRO",
      columns: ["id_miembro"],
      unique: true,
    },
    {
      name: "IDX_DIRECTIVA_MIEMBRO_PERIODO_USUARIO_ROL",
      columns: ["id_periodo", "id_usuario", "id_rol"],
      unique: true,
    },
  ],
});

export default DirectivaMiembroSchema;
