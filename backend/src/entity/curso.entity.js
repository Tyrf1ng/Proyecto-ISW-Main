"use strict";
import { EntitySchema } from "typeorm";

const CursoSchema = new EntitySchema({
  name: "Curso",
  tableName: "Cursos", 
  columns: {
    id_Curso: {
      type: "int",
      primary: true,
      generated: true,
    },
    nombreCurso: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    nivel: {
      type: "int",
      nullable: false,
    },
    rutDocente: { // Cambiado a rutDocente y varchar
      type: "varchar",
      length: 12,
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
  indices: [
    {
      name: "IDX_CURSO",
      columns: ["id_Curso"],
      unique: true,
    },
    {
      name: "IDX_DOCENTE_RUT",
      columns: ["rutDocente"], // Cambiado a rutDocente
      unique: true,
    },
  ],
  relations: {
    docente: {
      target: "User", // Relación con la tabla User
      type: "many-to-one", // Un docente puede estar en muchos cursos
      joinColumn: {
        name: "rutDocente",
        referencedColumnName: "rut",
      },
      onDelete: "CASCADE", // Elimina el curso si se borra el docente
    },
  },
});

export default CursoSchema;
