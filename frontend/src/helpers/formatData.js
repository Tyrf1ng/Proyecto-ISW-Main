import { startCase } from 'lodash';
import { format as formatRut } from 'rut.js';
import { format as formatTempo } from "@formkit/tempo";

export function formatUserData(usuario) {
    return {
        ...usuario,
        nombreCompleto: startCase(usuario.nombreCompleto),
        id_roles: startCase(usuario.id_roles),
        rut: formatRut(usuario.rut),
        createdAt: formatDateToDMY(usuario.createdAt),
        updatedAt: formatDateToDMY(usuario.updatedAt)
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
        createdAt: formatDateToDMY(user.createdAt)
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

export function formatDateToDMY(date) {
    if (!date) return null; // Maneja fechas no válidas
    return formatTempo(date, "DD-MM-YYYY");
}
