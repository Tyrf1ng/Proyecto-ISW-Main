"use strict";
import { EntitySchema } from "typeorm";

const Conect_Alumno_CursoSchema = new EntitySchema({
    name: "Conect_Alumno_Curso",
    tableName: "conect_Alumno_curso",
    columns: {
        rut: {
        type: "varchar",
        primary: true,
        nullable: false,
        },
        id_curso: {
        type: "int",
        primary: true,
        nullable: false,
        },
    },
    relations: {
        usuario: {
        target: "Usuario",
        type: "many-to-one",
        joinColumn: { name: "rut" },
        },
        curso: {
        target: "Curso",
        type: "many-to-one",
        joinColumn: { name: "id_curso" },
        },
    },
    });

export default Conect_Alumno_CursoSchema;