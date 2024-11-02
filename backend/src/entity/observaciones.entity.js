"use strict";
import { EntitySchema } from "typeorm";

const observacionesSchema = new EntitySchema({
    name: "Observacion",
    tableName: "observaciones",
    columns: {
      id_observaciones: {
        type: "int",
        primary: true,
        generated: true,
      },
      descripcion: {
        type: "varchar",
        nullable: false,
      },
      rut_administrativo: {
        type: "int",
        nullable: false,
      },
        rut_alumno: {
          type: "varchar",
          nullable: false,
        },
        Tipo: {
          type: "varchar",
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
      administrativo: {
          type: "one-to-many",
          target: "administrativo",
          joinColumn: { name: "rut_administrativo" } ,
      },
        alumno: {
            type: "many-to-one",
            target: "alumno",
            joinColumn: { name: "rut_alumno" } ,
        },
    },
  });
  
  export default observacionesSchema;
  