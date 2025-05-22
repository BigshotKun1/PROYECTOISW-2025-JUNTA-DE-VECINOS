import { EntitySchema } from "typeorm";

const DirectivaPeriodoSchema = new EntitySchema({
  name: "DirectivaPeriodo",
  tableName: "directiva_periodos",
  columns: {
    id_periodo: {
      type: "int",
      primary: true,
      generated: true,
    },
    fechaInicio: {
      type: "date",
      nullable: false,
      default: () => "CURRENT_DATE",
    },
    fechaTermino: {
      type: "date",
      nullable: false,
      default: () => "CURRENT_DATE",
    },
  },
  relations: {
    miembros: {
      target: "DirectivaMiembro",
      type: "one-to-many",
      inverseSide: "periodo",
    },
    eventos: {
      target: "Evento",
      type: "one-to-many",
      inverseSide: "periodo",
    },
    reuniones: {
      target: "Reunion",
      type: "one-to-many",
      inverseSide: "periodo",
    },
    votaciones: {
      target: "Votaciones",
      type: "one-to-many",
      inverseSide: "periodo",
    },
  },
  indices: [
    {
      name: "IDX_DIRECTIVA_PERIODO",
      columns: ["id_periodo"],
      unique: true,
    },
    {
      name: "IDX_DIRECTIVA_FECHA_INICIO",
      columns: ["fechaInicio"],
    },
    {
      name: "IDX_DIRECTIVA_FECHA_TERMINO",
      columns: ["fechaTermino"],
    },
  ],
});

export default DirectivaPeriodoSchema;
