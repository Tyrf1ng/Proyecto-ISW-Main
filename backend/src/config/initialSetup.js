"use strict";
import Curso from "../entity/curso.entity.js";
import Directivo from "../entity/directivo.entity.js";
import Roles from "../entity/roles.entity.js";
import Docentes from "../entity/docente.entity.js";
import Asignaturas from "../entity/asignatura.entity.js";
import Apoderado from "../entity/apoderado.entity.js";
import Alumnos from "../entity/alumno.entity.js";
import Asistencia from "../entity/asistencia.entity.js";
import Anotaciones from "../entity/anotacion.entity.js";
import Asignatura_Curso from "../entity/asignatura.curso.entity.js";
import Administrativos from "../entity/administrativo.entity.js";
import Ficha_Estudiante from "../entity/ficha.estudiante.entity.js";
import Notas from "../entity/nota.entity.js";
import Directivo_Cursos from "../entity/directivo_curso.entity.js";
import { AppDataSource } from "./configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";

async function createRoles() {
  try {
    const RolesRepository = AppDataSource.getRepository(Roles);

    const count = await RolesRepository.count();
    if (count > 0) return;

    await Promise.all([
      RolesRepository.save(
        RolesRepository.create({
          id_role: 1,
          nombre: "Directivo",
        }),
      ),
      RolesRepository.save(
        RolesRepository.create({
          id_role: 2,
          nombre: "Docente",
        }),
      ),
      RolesRepository.save(
        RolesRepository.create({
          id_role: 3,
          nombre: "Alumno",
        }),
      ),
      RolesRepository.save(
        RolesRepository.create({
          id_role: 4,
          nombre: "Apoderado",
        }),
      ),
      RolesRepository.save(
        RolesRepository.create({
          id_role: 5,
          nombre: "Administrativo",
        }),
      ),
      RolesRepository.save(
        RolesRepository.create({
          id_role: 6,
          nombre: "Encargado_Laboratorio",
        }),
      ),
    ]);
    console.log("* => Roles creados exitosamente");
  } catch (error) {
    console.error("Error al crear roles:", error);
  }
}

async function createDirectivos() {
  try {
    const directivosRepository = AppDataSource.getRepository(Directivo);

    const count = await directivosRepository.count();
    if (count > 0) return;

    await Promise.all([
      directivosRepository.save(
        directivosRepository.create({
          rut_directivo: "21.282.977-3",
          nombre: "Benjamin",
          apellido: "Ortiz",
          email: "benjamin@gmail.cl",
          password: await encryptPassword("admin123"),
          telefono: "987654321",
          id_role: 1,
        })
      ),
      directivosRepository.save(
        directivosRepository.create({
          rut_directivo: "21.070.073-0",
          nombre: "Joaquin",
          apellido: "Perez",
          email: "mochap@gmail.cl",
          password: await encryptPassword("mochap123"),
          telefono: "987654321",
          id_role: 1,
        })
      ),
    ]);
    console.log("* => Directivos creados exitosamente");
  } catch (error) {
    console.error("Error al crear directivos:", error);
  }
}

async function createCursos() {
  try {
    const cursoRepository = AppDataSource.getRepository(Curso);

    const count = await cursoRepository.count();
    if (count > 0) return;

    await Promise.all([
      cursoRepository.save(
        cursoRepository.create({
          nombre: "Sigma",
          nivel: 2,
        }),
      ),
      cursoRepository.save(
        cursoRepository.create({
          nombre: "Toilet",
          nivel: 4,
        }),
      ),
    ]);
    console.log("* => Cursos creados exitosamente");
  } catch (error) {
    console.error("Error al crear cursos:", error);
  }
}

async function createCursoDirectivos() {
  try {
    const cursoDirectivoRepository = AppDataSource.getRepository(Directivo_Cursos);

    const count = await cursoDirectivoRepository.count();
    if (count > 0) return;

    await Promise.all([
      cursoDirectivoRepository.save(
        cursoDirectivoRepository.create({
          id_curso: 1,
          rut_directivo: "21.282.977-3",
        }),
      ),
      cursoDirectivoRepository.save(
        cursoDirectivoRepository.create({
          id_curso: 2,
          rut_directivo: "21.282.977-3",
        }),
      ),
    ]);
    console.log("* => Cursos_Directivos creados exitosamente");
  } catch (error) {
    console.error("Error al crear cursos:", error);
  }
}

async function createDocente() {
  try {
    const DocenteRepository = AppDataSource.getRepository(Docentes);

    const count = await DocenteRepository.count();
    if (count > 0) return;

    await Promise.all([
      DocenteRepository.save(
        DocenteRepository.create({
          rut_docente: "5.126.663-3",
          nombre: "Sebastian",
          apellido: "Piñera",
          email:"Sebaspiña@gmail.cl",
          password: await encryptPassword("sebastian123"),
          telefono: "987654321",
          comuna:"Hualpen",
          direccion:"Calle falsa 123",
          id_role: 2,
        }),
      ),
    ]);
    console.log("* => Docentes creados exitosamente");
  } catch (error) {
    console.error("Error al crear docentes:", error);
  }
}

async function createAsignaturas() {
  try {
    const AsignaturasRepository = AppDataSource.getRepository(Asignaturas);

    const count = await AsignaturasRepository.count();
    if (count > 0) return;

    await Promise.all([
      AsignaturasRepository.save(
        AsignaturasRepository.create({
          nombre: "Matematicas",
          rut_docente: "5.126.663-3",
        }),
      ),
    ]);
    console.log("* => Asignaturas creadas exitosamente");
  } catch (error) {
    console.error("Error al crear asignaturas:", error);
  }
}


async function createAsignaturaCurso() {
  try {
    const AsignaturaCursoRepository = AppDataSource.getRepository(Asignatura_Curso);

    const count = await AsignaturaCursoRepository.count();
    if (count > 0) return;

    await Promise.all([
      AsignaturaCursoRepository.save(
        AsignaturaCursoRepository.create({
          id_curso: 1,
          id_asignatura: 1,
        }),
      ),
    ]);
    console.log("* => Anotaciones_Curso creadas exitosamente");
  } catch (error) {
    console.error("Error al crear anotaciones_curso:", error);
  }
}

async function createApoderado() {
  try {
    const ApoderadoRepository = AppDataSource.getRepository(Apoderado);

    const count = await ApoderadoRepository.count();
    if (count > 0) return;

    await Promise.all([
      ApoderadoRepository.save(
        ApoderadoRepository.create({
          rut_apoderado: "8.714.763-0",
          nombre: "Felipe",
          apellido: "Camiroaga",
          telefono: "987654321",
          email:"Angelparaunfinal@gmail.cl",
          password: await encryptPassword("felipin123"),
          id_role: 4,
        }),
      ),
    ]);
    console.log("* => Apoderados creadas exitosamente");
  } catch (error) {
    console.error("Error al crear apoderados:", error);
  }
}


async function createAlumnos() {
  try {
    const AlumnosRepository = AppDataSource.getRepository(Alumnos);

    const count = await AlumnosRepository.count();
    if (count > 0) return;

    await Promise.all([
      AlumnosRepository.save(
        AlumnosRepository.create({
          rut_alumno: "20.960.538-4",
          nombre: "Jonathan",
          apellido: "Olivares",
          fechaNacimiento: "2000-01-01",
          comuna: "Laja",
          direccion: "Calle falsa 321",
          email:"tyrfing@gmail.cl",
          password: await encryptPassword("iep123"),
          id_curso: 1,
          rut_apoderado: "8.714.763-0",
          id_role: 3,
        })
      ),
      AlumnosRepository.save(
        AlumnosRepository.create({
          rut_alumno: "4.705.624-1",
          nombre: "Isabel",
          apellido: "Allende",
          fechaNacimiento: "2000-01-01",
          comuna: "Santiago",
          direccion: "Calle falsa 321",
          email:"allende@gmail.cl",
          password: await encryptPassword("com123"),
          id_curso: 2,
          rut_apoderado: "8.714.763-0",
          id_role: 3,
        })
      ),
    ]);
    console.log("* => Alumnos creadas exitosamente");
  } catch (error) {
    console.error("Error al crear alumnos", error);
  }
}


async function createAnotaciones() {
  try {
    const AnotacionesRepository = AppDataSource.getRepository(Anotaciones);

    const count = await AnotacionesRepository.count();
    if (count > 0) return;

    await Promise.all([
      AnotacionesRepository.save(
        AnotacionesRepository.create({
          descripcion: "Distrayendo a compañeros en horario de clases",
          rut_alumno: "20.960.538-4",
          tipo: "Negativa",
          id_asignatura: 1,
        }),
      ),
    ]);
    console.log("* => Anotaciones creadas exitosamente");
  } catch (error) {
    console.error("Error al crear anotaciones:", error);
  }
}

async function createAsistencia() {
  try {
    const AsistenciaRepository = AppDataSource.getRepository(Asistencia);

    const count = await AsistenciaRepository.count();
    if (count > 0) return;

    await Promise.all([
      AsistenciaRepository.save(
        AsistenciaRepository.create({
          fecha: "2021-09-01",
          tipo: "Presente",
          rut_alumno: "20.960.538-4",
          id_asignatura: 1,
        }),
      ),
    ]);
    console.log("* => Asistencias creadas exitosamente");
  } catch (error) {
    console.error("Error al crear asistencia:", error);
  }
}

async function createNotas() {
  try {
    const NotasRepository = AppDataSource.getRepository(Notas);

    const count = await NotasRepository.count();
    if (count > 0) return;

    await Promise.all([
      NotasRepository.save(
        NotasRepository.create({
          tipo: "C1",
          valor: 0.3,
          rut_alumno: "20.960.538-4",
          id_asignatura: 1,
        }),
      ),
    ]);
    console.log("* => Notas creadas exitosamente");
  } catch (error) {
    console.error("Error al crear notas:", error);
  }
}



async function createAdministrativos() {
  try {
    const AdministrativosRepository = AppDataSource.getRepository(Administrativos);

    const count = await AdministrativosRepository.count();
    if (count > 0) return;

    await Promise.all([
      AdministrativosRepository.save(
        AdministrativosRepository.create({
          rut_administrativo: "7.254.916-3",
          nombre: "Enrique",
          apellido: "Paris",
          email:"paris@gmail.cl",
          password: await encryptPassword("paris123"),
          id_role: 5,
          telefono: "987654321",
        }),
      ),
    ]);
    console.log("* => Administrativo creados exitosamente");
  } catch (error) {
    console.error("Error al crear administrativos:", error);
  }
}

//FALTAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
async function createFicha_Estudiante() {
  try {
    const Ficha_EstudianteRepository = AppDataSource.getRepository(Ficha_Estudiante);

    const count = await Ficha_EstudianteRepository.count();
    if (count > 0) return;

    await Promise.all([
      Ficha_EstudianteRepository.save(
        Ficha_EstudianteRepository.create({
          tipo: "Salud",
          detalles:"Asintomatico a la chamba",ç,
          rut_alumno: "20.960.538-4",

        }),
      ),
    ]);
    console.log("* => Fichas creadas exitosamente");
  } catch (error) {
    console.error("Error al crear fichas:", error);
  }
}




export { createCursos,
  createCursoDirectivos
  ,createDirectivos
  , createRoles
  , createDocente
  , createAsignaturas
  , createApoderado, createAlumnos, createAnotaciones };

  