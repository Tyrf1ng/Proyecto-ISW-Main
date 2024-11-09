import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from '@pages/Root'; // El layout principal
import Home from '@pages/Home';
import Cursos from '@pages/Cursos';
import Users from '@pages/Users';
import Login from '@pages/Login';
import Error404 from '@pages/Error404';
import ProtectedRoute from '@components/ProtectedRoute';
import Notas from '@pages/Notas';
import '@styles/styles.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <Error404 />,
    children: [
      { path: 'home', element: <Home /> },
      { path: 'cursos', element: <Cursos /> },
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
