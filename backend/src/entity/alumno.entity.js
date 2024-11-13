"use strict";
import { EntitySchema } from "typeorm";

const AlumnoSchema = new EntitySchema({
  name: "Alumno",
  tableName: "alumno",
  columns: {
    rut_alumno: {
      type: "varchar",
      primary: true,
      nullable: false,
    },
    nombre: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    apellido: {
      type: "varchar",
      length: 255,
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
      nullable: false,
    },
    fechaNacimiento: {
      type: "date",
      nullable: false,
    },
    comuna: {
      type: "varchar",
      length: 100,
      nullable: false,
    },

    direccion: {
      type: "varchar",
      length: 255,
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
    rut_apoderado: {
      type: "varchar",
      nullable: false,
    },
    id_curso: {
      type: "int",
      nullable: false,
  },
  },
  relations: {
    curso: {
      type: "one-to-one",
      target: "Curso", 
      joinColumn: { name: "id_curso" } ,
    },
    apoderado:{
      type: "one-to-many",
      target: "Apoderado", 
      joinColumn: { name: "rut_apoderado" },
    }, 
    roles: {
      type: "many-to-one",
      target: "Roles", 
      joinColumn: { name: "id_roles" } ,
    },
  },

});
export default AlumnoSchema;