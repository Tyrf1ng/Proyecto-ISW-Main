"use strict";
import { EntitySchema } from "typeorm";

const CursoSchema = new EntitySchema({
  name: "Curso",
  tableName: "cursos",
  columns: {
    id_curso: {
      type: "int",
      primary: true,
      generated: true,
    },
    nombre: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    nivel: {
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
    // Relación con el Directivo
    rut_directivo: {
      type: "varchar",
      nullable: false,
    },
  },
  relations: {
    directivo: {
      type: "many-to-one",
      target: "Directivo", 
      joinColumn: { name: "rut_directivo" } ,
  }, },

});

export default CursoSchema;