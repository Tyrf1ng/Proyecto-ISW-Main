"use strict";
import { Like } from "typeorm";
import Usuario from "../entity/usuario.entity.js";
import { AppDataSource } from "../config/configDb.js";

/**
 * Obtener todos los usuarios
 */
export async function getUsuariosService() {
    try {
        const UsuarioRepository = AppDataSource.getRepository(Usuario);
        const usuarios = await UsuarioRepository.find();
        if (!usuarios || usuarios.length === 0) return [null, "No hay usuarios disponibles"];
        return [usuarios, null];
    } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Buscar usuario por RUT
 */
export async function getUsuarioByRutService(rut) {
    try {
        const UsuarioRepository = AppDataSource.getRepository(Usuario);
        const usuario = await UsuarioRepository.findOne({ where: { rut } });

        if (!usuario) {
            console.error(`Usuario con RUT ${rut} no encontrado`);
            return [null, "Usuario no encontrado"];
        }

        return [usuario, null];
    } catch (error) {
        console.error("Error al obtener el usuario:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Buscar usuarios por nombre
 */
export async function getUsuariosByNombreService(nombre) {
    try {
        const UsuarioRepository = AppDataSource.getRepository(Usuario);
        const usuarios = await UsuarioRepository.find({
            where: { nombre: Like(`%${nombre}%`) },
        });

        if (!usuarios || usuarios.length === 0) {
            return [null, "No se encontraron usuarios con el nombre proporcionado"];
        }

        return [usuarios, null];
    } catch (error) {
        console.error("Error al buscar usuarios por nombre:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Crear un nuevo usuario
 */
export async function createUsuarioService(data) {
    try {
        const { rut, nombre, apellido, email, password, direccion, comuna, id_roles, telefono } = data;
        const UsuarioRepository = AppDataSource.getRepository(Usuario);
        const nuevoUsuario = UsuarioRepository.create({
            rut,
            nombre,
            apellido,
            email,
            password,
            direccion,
            comuna,
            id_roles,
            telefono,
        });

        await UsuarioRepository.save(nuevoUsuario);
        return [nuevoUsuario, null];
    } catch (error) {
        console.error("Error al crear el usuario:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Actualizar información de un usuario
 */
export async function updateUsuarioService(rut, datosActualizados) {
    try {
        const UsuarioRepository = AppDataSource.getRepository(Usuario);
        const usuarioExistente = await UsuarioRepository.findOne({ where: { rut } });

        if (!usuarioExistente) {
            console.error(`Usuario con RUT ${rut} no encontrado`);
            return [null, "Usuario no encontrado"];
        }

        UsuarioRepository.merge(usuarioExistente, datosActualizados);
        await UsuarioRepository.save(usuarioExistente);

        return [usuarioExistente, null];
    } catch (error) {
        console.error("Error al actualizar el usuario:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Eliminar un usuario
 */
export async function deleteUsuarioService(rut) {
    try {
        const UsuarioRepository = AppDataSource.getRepository(Usuario);
        const usuario = await UsuarioRepository.findOne({ where: { rut } });

        if (!usuario) {
            console.error(`Usuario con RUT ${rut} no encontrado`);
            return [null, "Usuario no encontrado"];
        }

        await UsuarioRepository.remove(usuario);
        return [usuario, null];
    } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        return [null, "Error interno del servidor"];
    }
}
