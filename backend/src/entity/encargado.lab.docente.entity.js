"use strict";
import { EntitySchema } from "typeorm";

const EncargadolabDocenteSchema = new EntitySchema({
  name: "EncargadoLab_Docente",
  tableName: "encargadolab_docente",
  columns: {
    rut_encargado: {
      type: "int",
      primary: true,
      nullable: false,
    },
    rut_docente: {
      type: "int",
      primary: true,
      nullable: false,
    },
    fecha: {
      type: "date",
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
    encargado_lab: {
        type: "one-to-one",
        target: "Encargado_Lab", 
        joinColumn: { name: "rut_encargado" } ,
    },
    docentes: {
        type: "one-to-one",
        target: "Docentes", 
        joinColumn: { name: "rut_docente" } ,
    },
  },
});

export default EncargadolabDocenteSchema;