"use strict";
import { EntitySchema } from "typeorm";

const ReservaSchema = new EntitySchema({
    name: "Reserva",
    tableName: "reserva",
    columns: {
        id_reserva: {
            type: "int",
            primary: true,
            generated: true,
        },
        id_lab: {
            type: "int",
            nullable: false,
        },
        rut_docente: {
            type: "int",
            nullable: false,
        },
        fecha: {
            type: "date",
            nullable: false,
        },
        id_horario: {
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
        lab: {
            type: "one-to-one",
            target: "Labs", 
            joinColumn: { name: "id_lab" } ,
        },
        docente: {
            type: "one-to-one",
            target: "Docentes", 
            joinColumn: { name: "rut_docente" } ,
        },
        horarios: {
            type: "one-to-one",
            target: "Horarios", 
            joinColumn: { name: "id_horario" } ,
        },
    },
});

export default ReservaSchema;