import ReactDOM from 'react-dom/client';
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import '@styles/styles.css';

import Root from '@pages/Root';
import Inicio from '@pages/Inicio';
import Cursos from '@pages/Cursos';
import Login from '@pages/Login';
import Error404 from '@pages/Error404';
import Anotaciones from '@pages/Anotaciones';
import Labs from '@pages/Labs';
import Horarios from '@pages/Horarios';
import Ver_usuarios from '@pages/Ver_usuarios';
import VerNotas from '@pages/VerNotas';
import Ver_Nota_Alumno from '@pages/Ver_Nota_Alumno';
import Ver_Asistencias_Para_Alumno from '@pages/Ver_Asistencias_Para_Alumno';
import Ver_Anotaciones_Para_Alumno from '@pages/Ver_Anotaciones_Para_Alumno';
import Notas from '@pages/Notas';
import Add_notas from '@pages/Add_notas';
import Add_anotaciones from '@pages/Add_anotaciones';
import Ver_anotaciones from '@pages/Ver_anotaciones';
import VerAsistencias from '@pages/VerAsistencias';
import Reservas from '@pages/Reservas';
import Add_usuario from '@pages/Add_usuario';
import Asignaturas from '@pages/Asignaturas';
import Add_Reserva from '@pages/Add_reservas';
import ReservasDocentes from '@pages/ReservasDocentes';

import LabsDocente from './pages/LabsDocente';
import RegisterAsistencia from './pages/RegisterAsistencias';
import Add_docente from './pages/Add_docente';
import Ver_docentes from './pages/Ver_docentes';
import Add_enc_lab from './pages/Add_enc_lab';
import Add_reservasDocentes from '@pages/Add_reservasdocentes';
import ProtectedRoute from './components/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <Error404 />,
    children: [
      { path: 'inicio', element: <Inicio /> },
      { path: 'cursos', element: <Cursos /> },
      { path: 'asignaturas', element: <Asignaturas /> },
      {
        path: 'asistencias',
        element: <ProtectedRoute allowedRoles={['docente', 'directivo', 'alumno']} />,
        children: [
          {
            path: 'RegisterAsistencias',
            element: <ProtectedRoute allowedRoles={['docente']} />,
            children: [
              { path: '', element: <RegisterAsistencia /> },
            ],
          },
          {
            path: 'ver_asistencias',
            element: <ProtectedRoute allowedRoles={['docente']} />,
            children: [
              { path: '', element: <VerAsistencias /> },
            ],
          },
          {
            path: 'alumno',
            element: <ProtectedRoute allowedRoles={['alumno']} />,
            children: [
              { path: '', element: <Ver_Asistencias_Para_Alumno /> },
            ],
          },
        ],
      },
      {
        path: 'anotaciones',
        element: <ProtectedRoute allowedRoles={['docente', 'directivo', 'alumno']} />,
        children: [
          {
            path: 'add_anotaciones',
            element: <ProtectedRoute allowedRoles={['docente']} />,
            children: [
              { path: '', element: <Add_anotaciones /> },
            ],
          },
          {
            path: 'ver_anotaciones',
            element: <ProtectedRoute allowedRoles={['docente']} />,
            children: [
              { path: '', element: <Ver_anotaciones /> },
            ],
          },
          {
            path: 'alumno',
            element: <ProtectedRoute allowedRoles={['alumno']} />,
            children: [
              { path: '', element: <Ver_Anotaciones_Para_Alumno /> },
            ],
          },
        ],
      },
      {
        path: 'Notas',
        element: <ProtectedRoute allowedRoles={['docente', 'directivo', 'alumno']} />,
        children: [
          {
            path: 'add',
            element: <ProtectedRoute allowedRoles={['docente']} />,
            children: [
              { path: '', element: <Add_notas /> },
            ],
          },
          {
            path: 'ver_notas',
            element: <ProtectedRoute allowedRoles={['docente']} />,
            children: [
              { path: '', element: <VerNotas /> },
            ],
          },
          {
            path: 'Ver_Nota_Alumno',
            element: <ProtectedRoute allowedRoles={['alumno']} />,
            children: [
              { path: '', element: <Ver_Nota_Alumno /> },
            ],
          },
        ],
      },
      {
        path: 'gestion_reservas',
        element: <ProtectedRoute allowedRoles={['docente', 'directivo', 'encargado de laboratorio']} />,
        children: [
          {
            path: 'labs',
            element: <ProtectedRoute allowedRoles={['encargado de laboratorio']} />,
            children: [
              { path: '', element: <Labs /> },
            ],
          },
          {
            path: 'horarios',
            element: <ProtectedRoute allowedRoles={['encargado de laboratorio']} />,
            children: [
              { path: '', element: <Horarios /> },
            ],
          },
          {
            path: 'ver_reservas',
            element: <ProtectedRoute allowedRoles={['encargado de laboratorio']} />,
            children: [
              { path: '', element: <Reservas /> },
            ],
          },
          {
            path: 'add_reserva',
            element: <ProtectedRoute allowedRoles={['encargado de laboratorio']} />,
            children: [
              { path: '', element: <Add_Reserva /> },
            ],
          },
          {
            path: 'labsdocente',
            element: <ProtectedRoute allowedRoles={['docente']} />,
            children: [
              { path: '', element: <LabsDocente /> },
            ],
          },
          {
            path: 'add_reservadocente',
            element: <ProtectedRoute allowedRoles={['docente']} />,
            children: [
              { path: '', element: <Add_reservasDocentes /> },
            ],
          },
          {
            path: 'ver_reservasdocentes',
            element: <ProtectedRoute allowedRoles={['docente']} />,
            children: [
              { path: '', element: <ReservasDocentes /> },
            ],
          },
        ],
      },
      {
        path: 'gestionusuario',
        element: <ProtectedRoute allowedRoles={['directivo']} />,
        children: [
          { path: 'add_usuario', element: <Add_usuario /> },
          { path: 'add_docente', element: <Add_docente /> },
          { path: 'ver_usuarios', element: <Ver_usuarios /> },
          { path: 'ver_docentes', element: <Ver_docentes /> },
          { path: 'add_enc_lab', element: <Add_enc_lab /> },
        ],
      },
    ],
  },
  { path: '/auth', element: <Login /> },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);