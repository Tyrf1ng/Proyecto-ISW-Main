  import ReactDOM from 'react-dom/client';
  import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
  import Root from '@pages/Root'; // El layout principal
  import Inicio from '@pages/Inicio';
  import Cursos from '@pages/Cursos';
  import Login from '@pages/Login';
  import Error404 from '@pages/Error404';
  import ProtectedRoute from '@components/ProtectedRoute';
  import Anotaciones from '@pages/Anotaciones';
  import Labs from '@pages/Labs'; // Importa el nuevo componente Labs
  import Horarios from '@pages/Horarios'; // Importa el nuevo componente Horarios
  import VerNotas from '@pages/VerNotas';
  import Ver_Nota_Alumno from '@pages/Ver_Nota_Alumno';
  import Ver_Asistencias_Para_Alumno from '@pages/Ver_Asistencias_Para_Alumno'; // Importa el nuevo componente
  import Ver_Anotaciones_Para_Alumno from '@pages/Ver_Anotaciones_Para_Alumno'; // Importa el nuevo componente
  import Notas from '@pages/Notas';
  import Add_notas from '@pages/Add_notas';
  import Add_anotaciones from '@pages/Add_anotaciones';
  import Ver_anotaciones from '@pages/Ver_anotaciones';
  import '@styles/styles.css';
  import VerAsistencias from '@pages/VerAsistencias';
  import RegistrarAsistencias from '@pages/RegistrarAsistencias';
  import Reservas from '@pages/Reservas'; // Importa el nuevo componente Reservas

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      errorElement: <Error404 />,
      children: [
        { path: 'inicio', element: <Inicio /> },
        { path: 'cursos', element: <Cursos /> },
        {
          path: 'asistencias',
          element: <Outlet />,
          children: [
            { path: 'add_asistencias', element: <RegistrarAsistencias /> },
            { path: 'ver_asistencias', element: <VerAsistencias /> },
            { path: 'alumno', element: <Ver_Asistencias_Para_Alumno /> }, // Ruta para asistencias por alumno
          ]
        },
        {
          path: 'anotaciones',
          element: <Anotaciones />, // Componente principal de anotaciones
          children: [
            { path: 'add_anotaciones', element: <Add_anotaciones /> },
            { path: 'ver_anotaciones', element: <Ver_anotaciones /> },
            { path: 'alumno', element: <Ver_Anotaciones_Para_Alumno /> }, // Ruta para anotaciones por alumno
          ],
        },
        {
          path: 'Notas',
          element: <Notas />,
          children: [
            { path: 'add', element: <Add_notas /> },
            { path: 'Ver', element: <VerNotas /> },
            { path: 'Ver_Nota_Alumno', element: <Ver_Nota_Alumno /> },
          ],
        },
        { path: 'gestion_reservas',
          element: <Outlet />,
          children: [
            { path: 'labs', element: <Labs /> },
            { path: 'horarios', element: <Horarios /> },
            { path: 'reservas', element: <Reservas /> },
          ],
        },
      ],
    },
    { path: '/auth', element: <Login /> },
  ]);

  ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
  );
