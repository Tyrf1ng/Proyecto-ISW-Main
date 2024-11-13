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
    roles: {
      type: "many-to-one",
      target: "Roles", 
      joinColumn: { name: "id_roles" } ,
  },
},
});

export default ApoderadoSchema;
