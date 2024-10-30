"use strict";
import { EntitySchema } from "typeorm";

const Encargado_LabSchema = new EntitySchema({
  name: "Encargado_Lab",
  tableName: "encargado_lab",
  columns: {
    rut_encargado: {
      type: "varchar",
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
      nullable: false,
    },
    password: {
      type: "varchar",
      nullable: false,
    },
    telefono: {
      type: "int",
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
    roles: {
      type: "many-to-one",
      target: "Roles", 
      joinColumn: { name: "id_role" } ,
  },
  },
});

export default Encargado_LabSchema;
