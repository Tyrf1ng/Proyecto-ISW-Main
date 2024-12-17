"use strict";
import {
    createUsuarioService,
    deleteUsuarioService,
    getAlumnosPorCursoService,
    getUsuarioByRutService,
    getUsuariosByNombreService,
    getUsuariosService,
    updateUsuarioService, 
    getRutsDocentesService
} from "../services/usuario.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import { usuarioCreateValidation, usuarioEditValidation } from "../validations/usuario.validation.js";

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


export async function createUsuario(req, res) {
    try {
        const { rut } = req.params;
        const { nombre, apellido, email, direccion, comuna, id_roles, telefono } = req.body;
        if (!rut){
             return handleErrorClient(res, 400, "El rut es requerido");
        }
        const { error } = usuarioCreateValidation.validate(req.body);
       if (error) {
            return handleErrorClient(res, 400, error.message);
        }
        const [usuarioActualizado, errorUsuario] = await createUsuarioService({
             rut, nombre, apellido, email, direccion, comuna, telefono });

        if (errorUsuario) return handleErrorClient(res, 404, errorUsuario);
        handleSuccess(res, 201, "Usuario creado", usuarioActualizado);

    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}


export async function updateUsuario(req, res) {
    try {
        const { rut } = req.params;
        const { nombre, apellido, email, direccion, comuna, telefono, password } = req.body;

        const datosActualizados = { nombre, apellido, email, direccion, comuna,  telefono, password };
        const [usuario, errorUsuario] = await updateUsuarioService(rut, datosActualizados);
        if (errorUsuario) return handleErrorClient(res, 404, errorUsuario);
        handleSuccess(res, 200, "Usuario actualizado", usuario);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}


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


export async function getAlumnosPorCurso(req, res) {
    try {
        const { idCurso } = req.params; 
        const [usuarios, errorUsuarios] = await getAlumnosPorCursoService(idCurso);

        if (errorUsuarios) return handleErrorClient(res, 404, errorUsuarios);
        usuarios.length === 0
            ? handleSuccess(res, 204)
            : handleSuccess(res, 200, "Usuarios con rol 3 encontrados en el curso", usuarios);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getRutsDocentes(req, res) {
    try {
        const [docentes, errorDocentes] = await getRutsDocentesService();
        if (errorDocentes) return handleErrorClient(res, 404, errorDocentes);
        handleSuccess(res, 200, "Docentes encontrados", docentes);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}