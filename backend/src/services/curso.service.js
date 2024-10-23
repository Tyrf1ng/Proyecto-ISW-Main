"use strict";
import curso from "../entity/curso.entity.js";
import { AppDataSource } from "../config/configDb.js";

//Funcion para obtener 1 curso con consulta
export async function getCursoService(query){
    try {
        const { id, nombre, nivel } =query;
        const cursoRepository= AppDataSource.getRepository(curso)
        const cursoFound= await cursoRepository.findOne({
            where: [{ id: id }, { nombre: nombre }, { nivel: nivel }],
        })
            if (!cursoFound) return [null, "Usuario no encontrado"];


            return [cursoFound, null];

    } catch (error) {
        console.error("Error obtener el curso:", error);
    return [null, "Error interno del servidor"];
    }
}

//Funcion para obtener total de curso
export async function getCursosService() {
    try {
      const cursoRepository = AppDataSource.getRepository(curso);
  
      const cursos = await cursoRepository.find();
  
      if (!cursos|| cursos.length === 0) return [null, "No hay cursos"];
  

  
      return [cursos, null];
    } catch (error) {
      console.error("Error al obtener a los cursos:", error);
      return [null, "Error interno del servidor"];
    }
  }

/*
  export async function updateCursoService(query, body) {
    try {
      const  { id, nombre, nivel } = query;
  
      const cursoRepository = AppDataSource.getRepository(curso);
  
      const cursoFound = await cursoRepository.findOne({
        where: [{ id: id }, { nombre: nombre }, { nivel: nivel }]
      });
  
      if (!cursoFound) return [null, "Usuario no encontrado"];
  
      const existingcurso = await cursoRepository.findOne({
        where: [{ id: body.id }, { nombre: body.nombre }, { nivel: body.nivel } ],
      });
  
      if (existingcurso && existingUser.id !== userFound.id) {
        return [null, "Ya existe un curso con el mismo rut o email"];
      }
  
      if (body.password) {
        const matchPassword = await comparePassword(
          body.password,
          userFound.password,
        );
  
        if (!matchPassword) return [null, "La contraseña no coincide"];
      }
  
      const dataUserUpdate = {
        nombreCompleto: body.nombreCompleto,
        rut: body.rut,
        email: body.email,
        rol: body.rol,
        updatedAt: new Date(),
      };
  
      if (body.newPassword && body.newPassword.trim() !== "") {
        dataUserUpdate.password = await encryptPassword(body.newPassword);
      }

      await userRepository.update({ id: userFound.id }, dataUserUpdate);

      const userData = await userRepository.findOne({
        where: { id: userFound.id },
      });
  
      if (!userData) {
        return [null, "Usuario no encontrado después de actualizar"];
      }
  
      const { password, ...userUpdated } = userData;
  
      return [userUpdated, null];
    } catch (error) {
      console.error("Error al modificar un usuario:", error);
      return [null, "Error interno del servidor"];
    }
  } */