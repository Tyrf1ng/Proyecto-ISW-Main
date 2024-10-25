"use strict";
import { EntitySchema } from "typeorm";

const DirectivoSchema = new EntitySchema({
  name: "Directivo",
  tableName: "directivo",
  columns: {
    rut_directivo: {
      type: "varchar",
        nullable: false,
      primary: true,
    },
    nombre: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    apellido: {
      type: "varchar",
      nullable: false,
    },
    correo: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    telefono: {
      type: "varchar",
      length: 20,
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
    curso: {
      type: "one-to-many",
      target: "Curso", // La entidad relacionada
      joinColumn: { name: "rut_directivo" } ,
  }, },

});

export default DirectivoSchema;
