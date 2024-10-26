//DUDA DE COMO IMPLEMENTARLO BIEN


/*
"use strict";
import { EntitySchema } from "typeorm";

const AnotacionesAsignaturaSchema = new EntitySchema({
  name: "Anotaciones_Asignatura",
  tableName: "anotaciones_asignatura",
  columns: {
    id_anotacion: {
      type: "int",
      generated: true,
    },
    id_asignatura: {
      type: "int",
      nullable: false,
    },
  },
  relations: { 
    asignatura: {
        type: "one-to-one",
        target: "Asignaturas", // La entidad relacionada
        joinColumn: { name: "id_asignatura" } ,
    },
    anotacion: {
        type: "one-to-one",
        target: "Anotaciones", // La entidad relacionada
        joinColumn: { name: "id_anotacion" } ,
    },
  },
});

export default AnotacionesAsignaturaSchema;
*/