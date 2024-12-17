"use strict";
import Curso from "../entity/curso.entity.js";
import Asignaturas from "../entity/asignatura.entity.js";
import Asistencia from "../entity/asistencia.entity.js";
import Anotaciones from "../entity/anotacion.entity.js";
import Asignatura_Curso from "../entity/asignatura.curso.entity.js";
import Notas from "../entity/nota.entity.js";
import Labs from "../entity/lab.entity.js";
import Horarios from "../entity/horarios.entity.js";
import Reserva from "../entity/reserva.entity.js";
import Roles from "../entity/roles.entity.js";
import Conect_Usuario_Curso from "../entity/conect_usuario_curso.entity.js";
import Usuario from "../entity/usuario.entity.js";
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
          nombre: "Encargado_Laboratorio",
        }),
      ),
    ]);
    console.log("* => Roles creados exitosamente");
  } catch (error) {
    console.error("Error al crear roles:", error);
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
          nombre: "1ero medio A",
          nivel: 1,
          año: new Date(2024, 1, 1),
        }),
      ),
      cursoRepository.save(
        cursoRepository.create({
          nombre: "2do medio C",
          nivel: 2,
          año:new Date(2024, 1, 1),
        }),
      ),
      cursoRepository.save(
        cursoRepository.create({
          nombre: "3ero medio B",
          nivel: 3,
          año:new Date(2024, 1, 1),
        }),
      ),
    ]);
    console.log("* => Cursos creados exitosamente");
  } catch (error) {
    console.error("Error al crear cursos:", error);
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
          nombre: "Química",
          rut: "209605384",
        }),
      ),
      AsignaturasRepository.save(
        AsignaturasRepository.create({
          nombre: "Historia",
          rut: "211517735",
        }),
      ),
      AsignaturasRepository.save(
        AsignaturasRepository.create({
          nombre: "Matemáticas",
          rut: "221234567",
        }),
      ),
      AsignaturasRepository.save(
        AsignaturasRepository.create({
          nombre: "Lenguaje",
          rut: "201134567",
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
      AsignaturaCursoRepository.save(
        AsignaturaCursoRepository.create({
          id_curso: 2,
          id_asignatura: 1,
        }),
      ),
      AsignaturaCursoRepository.save(
        AsignaturaCursoRepository.create({
          id_curso: 1,
          id_asignatura: 2,
        }),
      ),
      AsignaturaCursoRepository.save(
        AsignaturaCursoRepository.create({
          id_curso: 2,
          id_asignatura: 2,
        }),
      ),
      AsignaturaCursoRepository.save(
        AsignaturaCursoRepository.create({
          id_curso: 1,
          id_asignatura: 3,
        }),
      ),
      AsignaturaCursoRepository.save(
        AsignaturaCursoRepository.create({
          id_curso: 2,
          id_asignatura: 3,
        }),
      ),
      AsignaturaCursoRepository.save(
        AsignaturaCursoRepository.create({
          id_curso: 1,
          id_asignatura: 4,
        }),
      ),
      AsignaturaCursoRepository.save(
        AsignaturaCursoRepository.create({
          id_curso: 2,
          id_asignatura: 4,
        }),
      ),
      AsignaturaCursoRepository.save(
        AsignaturaCursoRepository.create({
          id_curso: 3,
          id_asignatura: 1,
        })
      ),
      AsignaturaCursoRepository.save(
        AsignaturaCursoRepository.create({
          id_curso: 3,
          id_asignatura: 2,
        })
      ),
      AsignaturaCursoRepository.save(
        AsignaturaCursoRepository.create({
          id_curso: 3,
          id_asignatura: 3,
        })
      ),
      AsignaturaCursoRepository.save(
        AsignaturaCursoRepository.create({
          id_curso: 3,
          id_asignatura: 4,
        })
      ),

    ]);
    console.log("* => Anotaciones_Curso creadas exitosamente");
  } catch (error) {
    console.error("Error al crear anotaciones_curso:", error);
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
          descripcion: "Alumno asume como presidente del curso con mucha responsabilidad y entrega",
          rut: "210700730",
          tipo: "Positiva",
          id_asignatura: 1,
        }),
      ),
      AnotacionesRepository.save(
        AnotacionesRepository.create({
          descripcion: "Alumno constantemente interrumpe la clase intentando convencer a sus compañeros de unirse al partido comunista",
          rut: "210700730",
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
async function createNotas() {
  try {
    const NotasRepository = AppDataSource.getRepository(Notas);

    const count = await NotasRepository.count();
    if (count > 0) return;

    await Promise.all([
      NotasRepository.save(
        NotasRepository.create({
          tipo: "Prueba",
          valor: 2.3,
          rut: "210700730",
          id_asignatura: 1,
        }),
      ),
    ]);
    console.log("* => Notas creadas exitosamente");
  } catch (error) {
    console.error("Error al crear notas:", error);
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
          nombre: "Laboratorio de Química",
          capacidad: 30
        }),
      ),
      laboratoriosRepository.save(
        laboratoriosRepository.create({
          nombre: "Laboratorio de Física",
          capacidad: 18
        }),
      ),
      laboratoriosRepository.save(
        laboratoriosRepository.create({
          nombre: "Laboratorio de Biología",
          capacidad: 50
        }),
      ),
    ]);
    console.log("* => Labs creados exitosamente");
  } catch (error) {
    console.error("Error al crear labs:", error);
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
          hora_inicio: "08:10",
          hora_fin: "09:30",
        }),
      ),
      horariosRepository.save(
        horariosRepository.create({
          hora_inicio: "09:40",
          hora_fin: "11:00",
        }),
      ),
      horariosRepository.save(
        horariosRepository.create({
          hora_inicio: "11:00",
          hora_fin: "12:30",
        }),
      ),
    ]);
    console.log("* => Horarios creados exitosamente");
  } catch (error) {
    console.error("Error al crear horarios:", error);
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
          fecha:"2024-12-20",
          id_horario: 1,
          rut: "209605384",
          id_lab: 1,
          id_asignatura: 1,
          id_curso: 1,
        }),
      ),
      reservaRepository.save(
        reservaRepository.create({
          fecha:"2024-12-12",
          id_horario: 2,
          rut: "209605384",
          id_lab: 2,
          id_asignatura: 1,
          id_curso: 2,
        }),
      ),
      reservaRepository.save(
        reservaRepository.create({
          fecha:"2024-12-22",
          id_horario: 3,
          rut: "211517735",
          id_lab: 3,
          id_asignatura: 2,
          id_curso: 1,
        }),
      ),
      reservaRepository.save(
        reservaRepository.create({
          fecha:"2024-12-02",
          id_horario: 1,
          rut: "211517735",
          id_lab: 1,
          id_asignatura: 2,
          id_curso: 2,
        }),
      ),
    ]);
    console.log("* => Reservas creadas exitosamente");
  } catch (error) {
    console.error("Error al crear la reserva:", error);
  }
}

async function createConectUsuarioCurso() {
  try {
    const conectUsuarioCursoRepository = AppDataSource.getRepository(Conect_Usuario_Curso);

    const count = await conectUsuarioCursoRepository.count();
    if (count > 0) return;

    await Promise.all([
      conectUsuarioCursoRepository.save(
        conectUsuarioCursoRepository.create({
          rut: "210700730",
          id_curso: 1,
        }),
      ),
      conectUsuarioCursoRepository.save(
        conectUsuarioCursoRepository.create({
          rut: "211234567",
          id_curso: 2,
        }),
      ),
      conectUsuarioCursoRepository.save(
        conectUsuarioCursoRepository.create({
          rut: "217654321",
          id_curso: 2,
        }),
      ),
      conectUsuarioCursoRepository.save(
        conectUsuarioCursoRepository.create({
          rut: "219876543",
          id_curso: 1,
        }),
      ),
      conectUsuarioCursoRepository.save(
        conectUsuarioCursoRepository.create({
          rut: "201234567",
          id_curso: 3,
        }),
      ),
      conectUsuarioCursoRepository.save(
        conectUsuarioCursoRepository.create({
          rut: "221234367",
          id_curso: 3,
        }),
      ),
      conectUsuarioCursoRepository.save(
        conectUsuarioCursoRepository.create({
          rut: "201034102",
          id_curso: 1,
        }),
      ),
      conectUsuarioCursoRepository.save(
        conectUsuarioCursoRepository.create({
          rut: "201034362",
          id_curso: 2,
        }),
      ),
      conectUsuarioCursoRepository.save(
        conectUsuarioCursoRepository.create({
          rut: "201034105",
          id_curso: 3,
        }),
      ),
    ]);
    console.log("* => Conect_Usuario_Curso creadas exitosamente");
  }
  catch (error) {
    console.error("Error al crear conect_usuario_curso:", error);
  }
}


async function createUsuario() {
  try {
    const usuarioRepository = AppDataSource.getRepository(Usuario);

    const count = await usuarioRepository.count();
    if (count > 0) return;

    await Promise.all([
      usuarioRepository.save(
        usuarioRepository.create({
          rut: "212829773",
          nombre: "Benjamin",
          apellido: "Ortiz",
          email: "benjamin@gmail.cl",
          telefono: 123456789,
          password: await encryptPassword("benja123"),
          id_roles: 1,
          comuna: "LA City",
          direccion: "Calle falsa 123",
        }),
      ),
      usuarioRepository.save(
        usuarioRepository.create({
          rut: "209605384",
          nombre: "Jonathan",
          apellido: "Olivares",
          email: "jonypirinoli@gmail.cl",
          telefono: 987654321,
          password: await encryptPassword("jonypirinoli123"),
          id_roles: 2,
          comuna: "Laja City",
          direccion: "Calle del toilet 69",
        }),
      ),
      usuarioRepository.save(
        usuarioRepository.create({
          rut: "210700730",
          nombre: "Joaquin",
          apellido: "Perez",
          email: "mochap@gmail.cl",
          telefono: 987655321,
          password: await encryptPassword("mochap123"),
          id_roles: 3,
          comuna: "Conce City",
          direccion: "calle falsa 3",
        }),
      ),
      usuarioRepository.save(
        usuarioRepository.create({
          rut: "211517735",
          nombre: "Alvaro",
          apellido: "Loyola",
          email: "alvaro@gmail.cl",
          telefono: 987655321,
          password: await encryptPassword("alvaro123"),
          id_roles: 2,
          comuna: "Coronel City",
          direccion: "Calle coronel lota 69",
        }),
      ),
      usuarioRepository.save(
        usuarioRepository.create({
          rut: "211375086",
          nombre: "Nicolas",
          apellido: "Ibieta",
          email: "nicoflenn@gmail.cl",
          telefono: 987655321,
          password: await encryptPassword("nicoflenn123"),
          id_roles: 4,
          comuna: "Hualpen City",
          direccion: "Calle del sigma 69",
        }),
      ),
      usuarioRepository.save(
        usuarioRepository.create({
          rut: "210196439",
          nombre: "Cristobal",
          apellido: "Betancurt",
          email: "cristox@gmail.cl",
          telefono: 987655321,
          password: await encryptPassword("cristox123"),
          id_roles: 4,
          comuna: "Mulchen City",
          direccion: "Calle del papu 69",
        }),
        usuarioRepository.save(
          usuarioRepository.create({
            rut: "211234567",
            nombre: "Rocio",
            apellido: "Rivas",
            email: "rocio@gmail.cl",
            telefono: 123456789,
            password: await encryptPassword("rocio123"),
            id_roles: 3,
            comuna: "Comuna1",
            direccion: "Direccion1",
          }),
        ),
        usuarioRepository.save(
          usuarioRepository.create({
            rut: "217654321",
            nombre: "Alejandro",
            apellido: "Yañez",
            email: "alejandro@gmail.cl",
            telefono: 987654321,
            password: await encryptPassword("alejandro123"),
            id_roles: 3,
            comuna: "Comuna2",
            direccion: "Direccion2",
          }),
        ),
        usuarioRepository.save(
          usuarioRepository.create({
            
            rut: "219876543",
            nombre: "Kevin",
            apellido: "Miranda",
            email: "kevin@gmail.cl",
            telefono: 123456789,
            password: await encryptPassword("kevin123"),
            id_roles: 3,
            comuna: "Comuna3",
            direccion: "Direccion3",
          })
        ),
        usuarioRepository.save(
          usuarioRepository.create({
            rut: "221234567",
            nombre: "anita",
            apellido: "aroca",
            email: "anita@gmail.cl",
            telefono: 123456789,
            password: await encryptPassword("anita123"),
            id_roles: 2,
            comuna: "Comuna1",
            direccion: "Direccion1",
          }), 
        ),
        usuarioRepository.save(
          usuarioRepository.create({
            rut: "221234367",
            nombre: "Cristobal",
            apellido: "Fritz",
            email: "cristobalfritz@gmail.cl",
            telefono: 123456789,
            password: await encryptPassword("cristobal123"),
            id_roles: 3,
            comuna: "Comuna1",
            direccion: "Direccion1",
          }), 
        ),
        usuarioRepository.save(
          usuarioRepository.create({
            rut: "201234567",
            nombre: "daniel",
            apellido: "Monsalve",
            email: "daniel@gmail.cl",
            telefono: 123456789,
            password: await encryptPassword("daniel123"),
            id_roles: 3,
            comuna: "Comuna1",
            direccion: "Direccion1",
          }), 
        ),
        usuarioRepository.save(
          usuarioRepository.create({
            rut: "201134567",
            nombre: "javier",
            apellido: "Gonsalez",
            email: "javier@gmail.cl",
            telefono: 123456789,
            password: await encryptPassword("javier123"),
            id_roles: 2,
            comuna: "Comuna1",
            direccion: "Direccion1",
          }), 
        ),
        usuarioRepository.save(
          usuarioRepository.create({
            rut: "201034362",
            nombre: "anais",
            apellido: "saldias",
            email: "anais@gmail.cl",
            telefono: 123456789,
            password: await encryptPassword("anais123"),
            id_roles: 3,
            comuna: "Comuna1",
            direccion: "Direccion1",
          }), 
        ),
        usuarioRepository.save(
          usuarioRepository.create({
            rut: "201034102",
            nombre: "pablo",
            apellido: "sanchez",
            email: "pablo@gmail.cl",
            telefono: 123456789,
            password: await encryptPassword("pablo123"),
            id_roles: 3,
            comuna: "Comuna1",
            direccion: "Direccion1",
          }), 
        ),
        usuarioRepository.save(
          usuarioRepository.create({
            rut: "201034105",
            nombre: "sam",
            apellido: "fuentes",
            email: "sam@gmail.cl",
            telefono: 123456789,
            password: await encryptPassword("sam123"),
            id_roles: 3,
            comuna: "Comuna1",
            direccion: "Direccion1",
          }), 
        ),
      ),
    ]);
    console.log("* => Usuario creado exitosamente");
  }
  catch (error) {
    console.error("Error al crear usuario:", error);
  }
}


export { createConectUsuarioCurso
  , createCursos
  , createRoles
  , createAsignaturas
  , createAsignaturaCurso
  , createAnotaciones
  , createNotas
  , createLabs
  , createHorarios
  , createReserva
  , createUsuario
};

  