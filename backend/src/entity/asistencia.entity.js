"use strict";
import { EntitySchema } from "typeorm";

const AsistenciasSchema = new EntitySchema({
  name: "Asistencias",
  tableName: "asistencias",
  columns: {
    id_asistencia: {
      type: "int",
      primary: true,
      generated: true,
    },
    valor: {
      type: "boolean",
      nullable: false,
    },
    rut_alumno: {
      type: "varchar",
      nullable: false,
    },
    id_asignatura: {
      type: "int",
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
    alumno: {
        type: "one-to-one",
        target: "Alumno", // La entidad relacionada
        joinColumn: { name: "rut_alumno" } ,
    },
    asignatura: {
        type: "one-to-one",
        target: "Asignaturas", // La entidad relacionada
        joinColumn: { name: "id_asignatura" },

    },
  },
});

export default AsistenciasSchema;
