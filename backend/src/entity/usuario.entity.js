"use strict";
import { EntitySchema } from "typeorm";

const UsuarioSchema = new EntitySchema({
  name: "Usuario",
  tableName: "usuarios",
  columns: {
    rut: {
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
    direccion: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    comuna: {
        type: "varchar",
        length: 255,
        nullable: false,
    },
    id_roles: {
      type: "int",
      nullable: false,
    },
    telefono: {
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
      Roles: {
          type: "many-to-one",
          target: "Roles",
          joinColumn: { name: "id_roles" },
          nullable: false,
      },
  },
});
export default UsuarioSchema;