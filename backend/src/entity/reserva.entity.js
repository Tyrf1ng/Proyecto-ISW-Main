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
        rut: {
            type: "varchar",
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
            type: "many-to-one",
            target: "Labs", 
            joinColumn: { name: "id_lab" } ,
        },
        usuario: {
            type: "many-to-one",
            target: "Usuario", 
            joinColumn: { name: "rut" } ,
        },
        horarios: {
            type: "many-to-one",
            target: "Horarios", 
            joinColumn: { name: "id_horario" } ,
        },
    },
});

export default ReservaSchema;