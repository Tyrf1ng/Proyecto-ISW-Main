import { startCase } from 'lodash';
import { format as formatRut } from 'rut.js';
import { format as formatTempo } from "@formkit/tempo";

export function formatUserData(usuario) {
    return {
        ...usuario,
        nombreCompleto: startCase(usuario.nombreCompleto),
        id_roles: startCase(usuario.id_roles),
        rut: formatRut(usuario.rut),
        createdAt: formatTempo(usuario.createdAt, "DD-MM-YYYY"),
        updatedAt: formatTempo(usuario.updatedAtd, "DD-MM-YYYY")

    };
}

export function convertirMinusculas(obj) {
    for (let key in obj) {
        if (typeof obj[key] === 'string') {
            obj[key] = obj[key].toLowerCase();
        }
    }
    return obj;
}

export function formatPostUpdate(user) {
    return {
        nombreCompleto: startCase(user.nombreCompleto),
        rol: startCase(user.rol),
        rut: formatRut(user.rut),
        email: user.email,
        createdAt: formatTempo(user.createdAt, "DD-MM-YYYY")
    };
}

export function formatCourseData(course) {
    return {
        ...course,
        nombre: startCase(course.nombre),
        nivel: startCase(course.nivel),
        rut_directivo: formatRut(course.rut_directivo)
    };
}