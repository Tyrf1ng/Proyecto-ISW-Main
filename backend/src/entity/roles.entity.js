"use strict";
import { EntitySchema } from "typeorm";

const RolesSchema = new EntitySchema({
  name: "Roles",
  tableName: "roles",
  columns: {
    id_roles: {
      type: "int",
      primary: true,
      generated: true,
    },
    nombre: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
  },
});

export default RolesSchema;
