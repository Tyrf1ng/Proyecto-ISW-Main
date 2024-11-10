"use strict";
import { EntitySchema } from "typeorm";

const Horarios_EncargadoSchema = new EntitySchema({
    name: "Horarios_Encargado",
    tableName: "horarios_encargado",
    columns: {
        rut_encargado: {
            type: "int",
            primary: true,
            nullable: false,
        },
        id_horario: {
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
            target: "Encargado_Lab", 
            joinColumn: { name: "rut_encargado" } ,
        },
        horarios: {
            type: "one-to-one",
            target: "Horarios", 
            joinColumn: { name: "id_horario" } ,
        },
    },
});

export default Horarios_EncargadoSchema;