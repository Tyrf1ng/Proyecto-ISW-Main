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

import Profile from './pages/Profile';
import LabsDocente from './pages/LabsDocente';
import RegisterAsistencia from './pages/RegisterAsistencias';
import Add_docente from './pages/Add_docente';
import Ver_docentes from './pages/Ver_docentes';
import Add_enc_lab from './pages/Add_enc_lab';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <Error404 />,
    children: [
      { path: 'inicio', element: <Inicio /> },
      { path: 'cursos', element: <Cursos /> },
      { path: 'perfil', element: <Profile /> },
      { path: 'asignaturas', element: <Asignaturas /> },
      {
        path: 'asistencias',
        element: <Outlet />,
        children: [
          { path: 'RegisterAsistencias', element: <RegisterAsistencia /> },
          { path: 'ver_asistencias', element: <VerAsistencias /> },
          { path: 'alumno', element: <Ver_Asistencias_Para_Alumno /> },
        ]
      },
      {
        path: 'anotaciones',
        element: <Anotaciones />,
        children: [
          { path: 'add_anotaciones', element: <Add_anotaciones /> },
          { path: 'ver_anotaciones', element: <Ver_anotaciones /> },
          { path: 'alumno', element: <Ver_Anotaciones_Para_Alumno /> },
        ],
      },
      {
        path: 'Notas',
        element: <Notas />,
        children: [
          { path: 'add', element: <Add_notas /> },
          { path: 'ver_notas', element: <VerNotas /> },
          { path: 'Ver_Nota_Alumno', element: <Ver_Nota_Alumno /> },
        ],
      },
      {
        path: 'gestion_reservas',
        element: <Outlet />,
        children: [
          { path: 'labs', element: <Labs /> },
          { path: 'labsdocente', element: <LabsDocente /> },
          { path: 'horarios', element: <Horarios /> },
          { path: 'ver_reservas', element: <Reservas /> }, 
          { path: 'add_reserva', element: <Add_Reserva /> }, 
        ],
      },
      {
        path: 'gestionusuario',
        element: <Outlet />,
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