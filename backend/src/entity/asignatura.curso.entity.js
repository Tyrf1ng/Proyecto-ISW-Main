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
      type: "one-to-many",
      target: "Asignaturas",
      joinColumn: { name: "id_asignatura" },
    },
    cursos: {
      type: "one-to-many",
      target: "Curso",
      joinColumn: { name: "id_curso" },
    },
  },
});

export default AsignaturaCursoSchema;