"use strict";
import { EntitySchema } from "typeorm";

const Ficha_EstudianteSchema = new EntitySchema({
  name: "Ficha_Estudiante",
  tableName: "ficha_estudiante",
  columns: {
    id_ficha_es: {
      type: "int",
      primary: true,
      generated: true,
    },
    detalles: {
      type: "varchar",
      nullable: false,
    },
    rut_alumno: {
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
    alumno: {
        type: "one-to-one",
        target: "Alumno", 
        joinColumn: { name: "rut_alumno" } ,
    },
  },
});

export default Ficha_EstudianteSchema;
