    "use strict";
    import { Like } from "typeorm";
    import Usuario from "../entity/usuario.entity.js";
    import { AppDataSource } from "../config/configDb.js";


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

    export async function getAlumnosPorCursoService(idCurso) {
        try {
            const UsuarioRepository = AppDataSource.getRepository(Usuario);

            const usuarios = await UsuarioRepository.find({
                where: {
                    id_curso: idCurso, 
                    id_roles: 3, 
                },
            });

            if (!usuarios || usuarios.length === 0) {
                return [null, "No se encontraron usuarios con rol 3 en el curso especificado"];
            }

            return [usuarios, null];
        } catch (error) {
            console.error("Error al obtener usuarios con rol 3 por curso:", error);
            return [null, "Error interno del servidor"];
        }
    }

    export async function getRutsDocentesService() {
        try {
            const UsuarioRepository = AppDataSource.getRepository(Usuario);
            const usuarios = await UsuarioRepository.find({
                where: { id_roles: 2 },
                select: ["rut", "nombre", "apellido"]
            });
            if (!usuarios || usuarios.length === 0) {
                return [null, "No se encontraron usuarios con rol de docente"];
            }
            const docentes = usuarios.map(usuario => ({
                rut: usuario.rut,
                nombre: usuario.nombre,
                apellido: usuario.apellido
            }));
            return [docentes, null];
        } catch (error) {
            console.error("Error al obtener RUTs de usuarios con rol de docente:", error);
            return [null, "Error interno del servidor"];
        }
    }