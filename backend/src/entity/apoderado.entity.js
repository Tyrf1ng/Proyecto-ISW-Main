"use strict";
import { EntitySchema } from "typeorm";

const ApoderadoSchema = new EntitySchema({
  name: "Apoderado",
  tableName: "apoderado",
  columns: {
    rut_apoderado: {
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
    id_role: {
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
    alumno: {
      type: "one-to-many",
      target: "Alumno", // La entidad relacionada
      joinColumn: { name: "rut_apoderado" } ,
  },
    roles: {
      type: "many-to-one",
      target: "Roles", 
      joinColumn: { name: "id_role" } ,
  },
},

});

export default ApoderadoSchema;
