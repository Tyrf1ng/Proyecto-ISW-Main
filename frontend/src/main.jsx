import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from '@pages/Root'; // El layout principal
import Inicio from '@pages/Inicio';
import Cursos from '@pages/Cursos';
import Users from '@pages/Users';
import Login from '@pages/Login';
import Error404 from '@pages/Error404';
import ProtectedRoute from '@components/ProtectedRoute';
import Anotaciones from '@pages/Anotaciones';
import Labs from '@pages/Labs'; // Importa el nuevo componente Labs
import Horarios from '@pages/Horarios'; // Importa el nuevo componente Horarios
import VerNotas from '@pages/VerNotas';;
import Add_anotaciones from '@pages/Add_anotaciones'
import Ver_anotaciones from '@pages/Ver_anotaciones'
import '@styles/styles.css';
import VerAsistencias from '@pages/VerAsistencias';
import RegistrarAsistencias from '@pages/RegistrarAsistencias';
import Reservas from '@pages/Reservas'; // Importa el nuevo componente Reservas
import '@styles/styles.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <Error404 />,
    children: [
      { path: 'inicio', element: <Inicio /> },
      { path: 'cursos', element: <Cursos /> },
      {
        path: 'anotaciones',
        element: <Anotaciones />, // Componente principal de anotaciones
        children: [
          { path: 'add_anotaciones', element: <Add_anotaciones /> },
          { path: 'ver_anotaciones', element: <Ver_anotaciones /> },
        ],
      },
      { path: 'VerNotas', element: <VerNotas /> },
      { path: 'labs', element: <Labs /> },
      { path: 'horarios', element: <Horarios /> },
      { path: 'VerAsistencias/:id_curso', element: <VerAsistencias /> },
      { path: 'RegistrarAsistencias/:id_curso', element: <RegistrarAsistencias /> },
      { path: 'reservas', element: <Reservas /> }, // Añade la ruta para Reservas
      {
        path: 'users',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <Users />
          </ProtectedRoute>
        ),
      },
    ],
  },
  { path: '/auth', element: <Login /> },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);