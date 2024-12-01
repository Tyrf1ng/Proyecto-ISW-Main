"use strict";
import { EntitySchema } from "typeorm";

const Conect_Usuario_CursoSchema = new EntitySchema({
    name: "Conect_Usuario_Curso",
    tableName: "conect_usuario_curso",
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

export default Conect_Usuario_CursoSchema;