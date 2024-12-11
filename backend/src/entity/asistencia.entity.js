"use strict";
import { EntitySchema } from "typeorm";

const AsistenciasSchema = new EntitySchema({
  name: "Asistencias",
  tableName: "asistencias",
  columns: {
    id_asistencia: {
      type: "int",
      primary: true,
      generated: true,
    },
    rut: {
      type: "varchar",
      nullable: false,
    },
    id_asignatura: {
      type: "int",
      nullable: false,
    },
    tipo: {
      type: "varchar",
      nullable: false,
    },
    observacion: { 
      type: "text",
      nullable: true,
    },
    createdAt: {
        type: "timestamp with time zone",
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
    usuario: {
        type: "many-to-one",
        target: "Usuario", 
        joinColumn: { name: "rut" } ,
    },
    asignatura: {
        type: "many-to-one",
        target: "Asignaturas",
        joinColumn: { name: "id_asignatura" },

    },
  },
});

export default AsistenciasSchema;
