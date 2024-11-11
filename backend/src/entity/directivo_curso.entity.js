"use strict";
import { EntitySchema } from "typeorm";

const AsignaturasSchema = new EntitySchema({
  name: "Directivo_Cursos",
  tableName: "directivos_cursos",
  columns: {
    id_curso: {
      type: "int",
      primary: true,
      nullable: false,
    },
    rut_directivo: {
      type: "varchar",
      primary: true,
      nullable: false,
  },
  },
  relations: { 
    directivo: {
        type: "many-to-many",
        target: "Directivo", 
        joinColumn: { name: "rut_directivo" } ,
    },
    cursos: {
        type: "many-to-many",
        target: "Curso", 
        joinColumn: { name: "id_curso" } ,
    },
  },
});

export default AsignaturasSchema;
