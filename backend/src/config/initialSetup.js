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
import Observacion from "../entity/observaciones.entity.js";
import Encargado_Lab from "../entity/encargado.lab.entity.js";
import Labs from "../entity/lab.entity.js";
import Lab_Encargado from "../entity/lab.encargado.entity.js";
import Horarios from "../entity/horarios.entity.js";
import Horarios_Encargados from "../entity/horarios.encargado.entity.js";
import Reserva from "../entity/reserva.entity.js";
import Administrativo_Ficha from "../entity/administrativo.ficha.entity.js";
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
          id_roles: 1,
          nombre: "Directivo",
        }),
      ),
      RolesRepository.save(
        RolesRepository.create({
          id_roles: 2,
          nombre: "Docente",
        }),
      ),
      RolesRepository.save(
        RolesRepository.create({
          id_roles: 3,
          nombre: "Alumno",
        }),
      ),
      RolesRepository.save(
        RolesRepository.create({
          id_roles: 4,
          nombre: "Apoderado",
        }),
      ),
      RolesRepository.save(
        RolesRepository.create({
          id_roles: 5,
          nombre: "Administrativo",
        }),
      ),
      RolesRepository.save(
        RolesRepository.create({
          id_roles: 6,
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
          id_roles: 1,
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
          id_roles: 1,
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
          id_roles: 2,
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
          id_roles: 4,
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
          id_roles: 3,
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
          id_roles: 3,
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
          id_roles: 5,
          telefono: "987654321",
        }),
      ),
    ]);
    console.log("* => Administrativo creados exitosamente");
  } catch (error) {
    console.error("Error al crear administrativos:", error);
  }
}

async function createFicha_Estudiante() {
  try {
    const Ficha_EstudianteRepository = AppDataSource.getRepository(Ficha_Estudiante);

    const count = await Ficha_EstudianteRepository.count();
    if (count > 0) return;

    await Promise.all([
      Ficha_EstudianteRepository.save(
        Ficha_EstudianteRepository.create({
          tipo: "Salud",
          detalles:"Asintomatico a la chamba",
          rut_alumno: "20.960.538-4",

        }),
      ),
    ]);
    console.log("* => Fichas creadas exitosamente");
  } catch (error) {
    console.error("Error al crear fichas:", error);
  }
}

async function createConex_Adminis_Ficha() {
  try {
    const conex_adminis_fichaRepository = AppDataSource.getRepository(Administrativo_Ficha);

    const count = await conex_adminis_fichaRepository.count();
    if (count > 0) return;

    await Promise.all([
      conex_adminis_fichaRepository.save(
        conex_adminis_fichaRepository.create({
          rut_administrativo: "7.254.916-3",
          id_ficha_estudiante: 1
        }),
      ),
    ]);
    console.log("* => Conex Adminis_Ficha creados exitosamente");
  }
  catch (error) {
    console.error("Error al crear conex_adminis_ficha:", error);
  }
}


async function createObservaciones() {
  try {
    const observacionesRepository = AppDataSource.getRepository(Observacion);

    const count = await observacionesRepository.count();
    if (count > 0) return;

    await Promise.all([
      observacionesRepository.save(
        observacionesRepository.create({
          descripcion: "Llega atrasado",
          Tipo: "Atraso",
          rut_alumno: "20.960.538-4",
          rut_administrativo: "7.254.916-3",
        }),
      ),
    ]);
    console.log("* => Observaciones creadas exitosamente");
  } catch (error) {
    console.error("Error al crear observaciones:", error);
  }
}


async function createEncargados_Lab() {
  try {
    const encargados_labRepository = AppDataSource.getRepository(Encargado_Lab);

    const count = await encargados_labRepository.count();
    if (count > 0) return;

    await Promise.all([
      encargados_labRepository.save(
        encargados_labRepository.create({
          rut_encargado: "21.019.643-9",
          nombre: "Cristobal",
          apellido: "Cristox",
          email: "cristox@gmail.cl",
          id_roles: 6,
          password: await encryptPassword("cristox123"),
          telefono: "987654321",
        }),
      ),
    ]);
    console.log("* => Encargados labs creados exitosamente");
  } catch (error) {
    console.error("Error al crear encargados labs:", error);
  }
}

async function createLabs() {
  try {
    const laboratoriosRepository = AppDataSource.getRepository(Labs);

    const count = await laboratoriosRepository.count();
    if (count > 0) return;

    await Promise.all([
      laboratoriosRepository.save(
        laboratoriosRepository.create({
          nombre: "Lab1",
          capacidad: 30
        }),
      ),
    ]);
    console.log("* => Labs creados exitosamente");
  } catch (error) {
    console.error("Error al crear labs:", error);
  }
}


async function createConex_Lab_Encargado() {
  try {
    const lab_encargadosRepository = AppDataSource.getRepository(Lab_Encargado);

    const count = await lab_encargadosRepository.count();
    if (count > 0) return;

    await Promise.all([
      lab_encargadosRepository.save(
        lab_encargadosRepository.create({
          rut_encargado: "21.019.643-9",
          id_lab: 1
        }),
      ),
    ]);
    console.log("* => Conex Lab_Encar creados exitosamente");
  } catch (error) {
    console.error("Error al crear conex_lab_encar:", error);
  }
}

async function createHorarios() {
  try {
    const horariosRepository = AppDataSource.getRepository(Horarios);

    const count = await horariosRepository.count();
    if (count > 0) return;

    await Promise.all([
      horariosRepository.save(
        horariosRepository.create({
          hora_inicio:"08:10:00",
          hora_fin:"09:30:00"
        }),
      ),
    ]);
    console.log("* => Horarios creados exitosamente");
  } catch (error) {
    console.error("Error al crear horarios:", error);
  }
}

async function createConex_Encargado_Horario() {
  try {
    const conex_encargado_horarioRepository = AppDataSource.getRepository(Horarios_Encargados);

    const count = await conex_encargado_horarioRepository.count();
    if (count > 0) return;

    await Promise.all([
      conex_encargado_horarioRepository.save(
        conex_encargado_horarioRepository.create({
          rut_encargado: "21.019.643-9",
          id_horario: 1
        }),
      ),
    ]);
    console.log("* => Conexion encargado horarios creados exitosamente");
  } catch (error) {
    console.error("Error al crear la conexion de horario con encargado:", error);
  }
}

async function createReserva() {
  try {
    const reservaRepository = AppDataSource.getRepository(Reserva);

    const count = await reservaRepository.count();
    if (count > 0) return;

    await Promise.all([
      reservaRepository.save(
        reservaRepository.create({
          fecha:"2021-09-01",
          id_horario: 1,
          rut_docente: "5.126.663-3",
          id_lab: 1
        }),
      ),
    ]);
    console.log("* => Reservas creadas exitosamente");
  } catch (error) {
    console.error("Error al crear la reserva:", error);
  }
}

export { createCursos,
  createCursoDirectivos
  ,createDirectivos
  , createRoles
  , createDocente
  , createAsignaturas
  , createAsignaturaCurso
  , createApoderado
  , createAlumnos
  , createAnotaciones
  , createAsistencia
  , createNotas
  , createAdministrativos
  , createFicha_Estudiante
  , createConex_Adminis_Ficha
  , createObservaciones
  , createEncargados_Lab
  , createLabs
  , createConex_Lab_Encargado
  , createHorarios
  , createConex_Encargado_Horario
  , createReserva
};

  