"use strict";
import { EntitySchema } from "typeorm";

const HorariosSchema = new EntitySchema({
    name: "Horarios",
    tableName: "horarios",
    columns: {
        id_horario: {
            type: "int",
            primary: true,
            generated: true,
        },
        hora_inicio: {
            type: "time",
            nullable: false,
        },
        hora_fin: {
            type: "time",
            nullable: false,
        },
        rut_encargado: {
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
        encargado_lab: {
            type: "many-to-one",
            target: "Encargado_Lab",
            joinColumn: { name: "rut_encargado" },
            nullable: false,
        },
    },
});

export default HorariosSchema;