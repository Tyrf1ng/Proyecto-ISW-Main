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
      type: "varchar",  // Debe ser del mismo tipo que el campo 'rut' en Usuario
      nullable: false,
      unique: true,
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
      type: "Many-to-One",
      target: "Usuario", 
      joinColumn: { 
        name: "rut",  // La columna que actúa como clave foránea
        referencedColumnName: "rut"  // Asegúrate de que se refiere a la columna 'rut' en la tabla Usuario
      },
    },
  },
});

export default AsignaturasSchema;
