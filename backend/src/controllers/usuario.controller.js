"use strict";
import { 
    createUsuarioService,
    deleteUsuarioService,
    getUsuarioByRutService,
    getUsuariosByNombreService,
    getUsuariosService,
    updateUsuarioService
} from "../services/usuario.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

/**
 * Obtener todos los usuarios
 */
export async function getUsuarios(req, res) {
    try {
        const [usuarios, errorUsuarios] = await getUsuariosService();
        if (errorUsuarios) return handleErrorClient(res, 404, errorUsuarios);
        usuarios.length === 0
            ? handleSuccess(res, 204)
            : handleSuccess(res, 200, "Usuarios encontrados", usuarios);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

/**
 * Buscar un usuario por RUT
 */
export async function getUsuarioByRut(req, res) {
    try {
        const { rut } = req.params;
        const [usuario, errorUsuario] = await getUsuarioByRutService(rut);
        if (errorUsuario) return handleErrorClient(res, 404, errorUsuario);
        handleSuccess(res, 200, "Usuario encontrado", usuario);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

/**
 * Buscar usuarios por nombre
 */
export async function getUsuariosByNombre(req, res) {
    try {
        const { nombre } = req.query;
        const [usuarios, errorUsuarios] = await getUsuariosByNombreService(nombre);
        if (errorUsuarios) return handleErrorClient(res, 404, errorUsuarios);
        usuarios.length === 0
            ? handleSuccess(res, 204)
            : handleSuccess(res, 200, "Usuarios encontrados", usuarios);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

/**
 * Crear un nuevo usuario
 */
export async function createUsuario(req, res) {
    try {
        const { rut, nombre, apellido, email, password, direccion, comuna, id_roles, telefono } = req.body;
        const [usuario, errorUsuario] = await createUsuarioService({ rut, nombre, apellido, email, password, direccion, comuna, id_roles, telefono });
        if (errorUsuario) return handleErrorClient(res, 404, errorUsuario);
        handleSuccess(res, 201, "Usuario creado", usuario);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

/**
 * Actualizar información de un usuario
 */
export async function updateUsuario(req, res) {
    try {
        const { rut } = req.params;
        const { nombre, apellido, email, direccion, comuna, id_roles, telefono } = req.body;

        const datosActualizados = { nombre, apellido, email, direccion, comuna, id_roles, telefono };
        const [usuario, errorUsuario] = await updateUsuarioService(rut, datosActualizados);
        if (errorUsuario) return handleErrorClient(res, 404, errorUsuario);
        handleSuccess(res, 200, "Usuario actualizado", usuario);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

/**
 * Eliminar un usuario
 */
export async function deleteUsuario(req, res) {
    try {
        const { rut } = req.params;
        const [usuario, errorUsuario] = await deleteUsuarioService(rut);
        if (errorUsuario) return handleErrorClient(res, 404, errorUsuario);
        handleSuccess(res, 200, "Usuario eliminado", usuario);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}
