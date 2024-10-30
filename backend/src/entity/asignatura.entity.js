"use strict";
import { EntitySchema } from "typeorm";

const AsignaturasSchema = new EntitySchema({
  name: "Asignaturas",
  tableName: "asignaturas",
  columns: {
    id_asignatura: {
      type: "int",
      primary: true,
      generated: true,
    },
    nombre: {
      type: "varchar",
      nullable: false,
    },
    rut_docente: {
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
  },
  relations: { 
    docente: {
        type: "one-to-one",
        target: "Docentes", 
        joinColumn: { name: "rut_docente" } ,
    },
  },
});

export default AsignaturasSchema;
