"use strict";
import { EntitySchema } from "typeorm";

const DocentesSchema = new EntitySchema({
  name: "Docentes",
  tableName: "docentes",
  columns: {
    rut_docente: {
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
    telefono: {
      type: "int",
      nullable: false,
    },
    comuna: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    direccion: {
      type: "varchar",
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
}
);

export default DocentesSchema;