"use strict";
import { EntitySchema } from "typeorm";

const AdministrativoSchema = new EntitySchema({
  name: "Administrativo",
  tableName: "administrativo",
  columns: {
    rut_administrativo: {
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
  }, },
});

export default AdministrativoSchema;
