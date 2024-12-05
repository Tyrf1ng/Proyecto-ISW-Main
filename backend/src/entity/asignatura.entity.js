"use strict";
import { EntitySchema } from "typeorm";

const AsignaturasSchema = new EntitySchema({
  name: "Asignaturas",
  tableName: "asignaturas",
  columns: {
    id_asignatura: {
      type: "int",
      primary: true,
      generated: true,
    },
    nombre: {
      type: "varchar",
      nullable: false,
    },
    rut: {
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
    usuario: {
        type: "One-to-one",
        target: "Usuario", 
        joinColumn: { name: "rut" } ,
    },
  },
  indices: [
    {
      name: "IDX_RUT_UNICO",
      columns: ["rut"],
      unique: true, // Aquí se asegura que el campo 'rut' sea único en la tabla asignaturas.
    },
  ],
});

export default AsignaturasSchema;
