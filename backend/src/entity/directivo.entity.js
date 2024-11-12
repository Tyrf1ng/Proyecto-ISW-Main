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
    email: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    password: {
      type: "varchar",
      length: 255,
      nullable: false
    },
    telefono: {
      type: "varchar",
      length: 20,
      nullable: false,
    },
    id_roles: {
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
  },
  relations: {
    curso: {
      type: "one-to-many",
      target: "Curso",
      joinColumn: { name: "rut_directivo" } ,
  }, 
    roles: {
      type: "many-to-one",
      target: "Roles", 
      joinColumn: { name: "id_roles" } ,
  },
},

});

export default DirectivoSchema;
