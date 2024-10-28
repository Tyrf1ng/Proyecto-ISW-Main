"use strict";
import { EntitySchema } from "typeorm";

const NotasSchema = new EntitySchema({
  name: "Notas",
  tableName: "notas",
  columns: {
    id_nota: {
      type: "int",
      primary: true,
      generated: true,
    },
    tipo: {
      type: "varchar",
      nullable: false,
    },
    valor: {
      type: "float",
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
        joinColumn: { name: "id_asigntura" } ,
    },
  },
});

export default NotasSchema;
