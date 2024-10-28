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
    rut_administrativo: {
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
    administrativo: {
      type: "one-to-one",
      target: "Administrativo", // La entidad relacionada
      joinColumn: { name: "rut_administrativo" } ,
    }, 
    alumno: {
        type: "one-to-one",
        target: "Alumno", // La entidad relacionada
        joinColumn: { name: "rut_alumno" } ,
    },
  },
});

export default Ficha_EstudianteSchema;
