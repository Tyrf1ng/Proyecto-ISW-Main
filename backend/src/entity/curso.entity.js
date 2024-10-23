"use strict";
import { EntitySchema } from "typeorm";

const CursoSchema = new EntitySchema({
  name: "Curso",
  tableName: "cursos",
  columns: {
    id: {
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
    // Relación con el usuario
    usuarioId: {
      type: "int",
      nullable: false,
    },
  },
  relations: {
    usuario: {
      type: "many-to-one",
      target: "User", // La entidad relacionada
      joinColumn: { name: "usuarioId" },
      onDelete: "CASCADE", // Si el usuario se elimina, también se elimina el curso
    },
  },
  indices: [
    {
      name: "IDX_CURSO",
      columns: ["id"],
      unique: true,
    },
    {
      name: "IDX_CURSO_USUARIO",
      columns: ["usuarioId"],
    },
  ],
});

export default CursoSchema;