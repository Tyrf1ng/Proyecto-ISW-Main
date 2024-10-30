"use strict";
import { EntitySchema } from "typeorm";

const AnotacionesSchema = new EntitySchema({
  name: "Anotaciones",
  tableName: "anotaciones",
  columns: {
    id_anotacion: {
      type: "int",
      primary: true,
      generated: true,
    },
    descripcion: {
      type: "varchar",
      nullable: false,
    },
    rut_alumno: {
      type: "varchar",
      nullable: false,
    },
    tipo: {
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
        type: "many-to-one",
        target: "Alumno", 
        joinColumn: { name: "rut_alumno" } ,
    },
    asignatura: {
        type: "many-to-one",
        target: "Asignaturas", 
        joinColumn: { name: "id_asignatura" } ,
    },
  },
});

export default AnotacionesSchema;
