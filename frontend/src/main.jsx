import ReactDOM from 'react-dom/client';
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Root from '@pages/Root'; // El layout principal
import Inicio from '@pages/Inicio';
import Cursos from '@pages/Cursos';
import Login from '@pages/Login';
import Error404 from '@pages/Error404';
import ProtectedRoute from '@components/ProtectedRoute'; // Mantener este import si es necesario
import Anotaciones from '@pages/Anotaciones';
import Labs from '@pages/Labs';
import Horarios from '@pages/Horarios';
import VerNotas from '@pages/VerNotas';
import Ver_Nota_Alumno from '@pages/Ver_Nota_Alumno';
import Ver_Asistencias_Para_Alumno from '@pages/Ver_Asistencias_Para_Alumno';
import Ver_Anotaciones_Para_Alumno from '@pages/Ver_Anotaciones_Para_Alumno';
import Notas from '@pages/Notas';
import Add_notas from '@pages/Add_notas';
import Add_anotaciones from '@pages/Add_anotaciones';
import Ver_anotaciones from '@pages/Ver_anotaciones';
import '@styles/styles.css';
import VerAsistencias from '@pages/VerAsistencias';
import RegistrarAsistencias from '@pages/RegistrarAsistencias';
import Reservas from '@pages/Reservas';
import Profile from './pages/Profile';
import Add_usuario from '@pages/Add_usuario';
import Asignaturas from '@pages/Asignaturas';
import LabsDocente from './pages/LabsDocente';
import RegisterAsistencia from './pages/RegisterAsistencias';
import Add_Reserva from '@pages/Add_reservas'; // Asegúrate de que la ruta sea correcta

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
          { path: 'ver_reservas', element: <Reservas /> }, // Cambié el nombre del componente
          { path: 'add_reserva', element: <Add_Reserva /> }, // Nueva ruta
        ],
      },
      {
        path: 'gestionusuario',
        element: <Outlet />,
        children: [
          { path: 'add_usuario', element: <Add_usuario /> },
        ],
      },
    ],
  },
  { path: '/auth', element: <Login /> },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);