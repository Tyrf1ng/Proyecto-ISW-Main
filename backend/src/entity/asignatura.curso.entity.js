"use strict";
import { EntitySchema } from "typeorm";

const AsignaturaCursoSchema = new EntitySchema({
  name: "Asignatura_Curso",
  tableName: "asignatura_curso",
  columns: {
    id_asignatura: {
      type: "int",
      primary: true,
      nullable: false,
    },
    id_curso: {
      type: "int",
      primary: true,
      nullable: false,
    },
  },
  relations: {
    asignaturas: {
      type: "many-to-one",
      target: "Asignaturas",
      joinColumn: { name: "id_asignatura" },
    },
    cursos: {
      type: "many-to-one",
      target: "Curso",
      joinColumn: { name: "id_curso" },
    },
  },
});

export default AsignaturaCursoSchema;