"use strict";
import { EntitySchema } from "typeorm";

const Administrativo_FichaSchema = new EntitySchema({
  name: "Administrativo_Ficha",
  tableName: "administrativo_ficha",
  columns: {
    rut_administrativo: {
      type: "varchar",
      primary: true,
      nullable: false,
    },
    id_ficha_estudiante: {
        type: "varchar",
        primary: true,
        nullable: false,
      },
  },
  relations: {
    administrativo: {
        type: "one-to-one",
        target: "Administrativo", 
        joinColumn: { name: "rut_administrativo" } ,
    },
    ficha_estudiante: {
        type: "one-to-one",
        target: "Ficha_Estudiante", 
        joinColumn: { name: "id_ficha_estudiante" } ,
    },
  },
});

export default Administrativo_FichaSchema;
