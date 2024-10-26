"use strict";
import { EntitySchema } from "typeorm";

const Lab_EncargadoSchema = new EntitySchema({
  name: "Lab_Encargado",
  tableName: "lab_encargado",
  columns: {
    rut_encargado: {
      type: "int",
      primary: true,
      nullable: false,
    },
    id_lab: {
      type: "int",
      primary: true,
      generated: true,
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
    encargado_lab: {
        type: "one-to-one",
        target: "Encargado_Lab", // La entidad relacionada
        joinColumn: { name: "rut_encargado" } ,
    },
    labs: {
        type: "one-to-one",
        target: "Labs", // La entidad relacionada
        joinColumn: { name: "id_lab" } ,
    },
  },
});

export default Lab_EncargadoSchema;