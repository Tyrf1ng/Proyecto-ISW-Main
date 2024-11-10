import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from '@pages/Root'; // El layout principal
import Home from '@pages/Home';
import Cursos from '@pages/Cursos';
import Users from '@pages/Users';
import Login from '@pages/Login';
import Error404 from '@pages/Error404';
import ProtectedRoute from '@components/ProtectedRoute';
import Anotaciones from '@pages/Anotaciones';
import Notas from '@pages/Notas';
import '@styles/styles.css';
import Asistencias from '@pages/Asistencias';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <Error404 />,
    children: [
      { path: 'home', element: <Home /> },
      { path: 'cursos', element: <Cursos /> },
      { path: 'anotaciones', element: <Anotaciones /> },
      { path: 'notas', element: <Notas /> },
      {path: 'asistencias', element: <Asistencias />},
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
