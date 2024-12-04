import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '@services/auth.service.js';
import '@styles/index.css'; 
import SchoolIcon from '@mui/icons-material/School';
import HistoryEduRoundedIcon from '@mui/icons-material/HistoryEduRounded';
import { Outlet } from 'react-router-dom';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import AddIcon from '@mui/icons-material/Add';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import AlarmIcon from '@mui/icons-material/Alarm';
import BiotechIcon from '@mui/icons-material/Biotech';
import EventIcon from '@mui/icons-material/Event';
// Importar logo local
import logo from '../images/components/logo.svg'; 

// Configuración de navegación por roles
const NAVIGATION_BY_ROLE = {
  directivo: [
    { segment: 'GestionUsuarios', title: 'Gestión de Usuarios', icon: <SchoolIcon /> },
  ],
  docente: [
    {
      segment: 'asistencias',
      title: 'Asistencias',
      icon: <PeopleAltIcon />,
      children: [
        { segment: 'add_asistencias', title: 'Añadir asistencias', icon: <AddIcon /> },
        { segment: 'ver_asistencias', title: 'Ver todas las asistencias', icon: <ManageSearchIcon /> },
      ],
    },
    {
      segment: 'anotaciones',
      title: 'Anotaciones',
      icon: <HistoryEduRoundedIcon />,
      children: [
        { segment: 'add_anotaciones', title: 'Añadir anotaciones', icon: <ManageSearchIcon /> },
        { segment: 'ver_anotaciones', title: 'Ver todas las Anotaciones', icon: <ManageSearchIcon /> },
      ],
    },
    {
      segment: 'notas',
      title: 'Notas',
      icon: <HistoryEduRoundedIcon />,
      children: [
        { segment: 'ver_notas', title: 'Ver Notas', icon: <ManageSearchIcon /> },
        { segment: "add", title: "Añadir Notas", icon: <AddIcon /> },
      ],
    },
    {
      segment: 'gestion_reservas',
      title: 'Gestion Reservas Laboratorio',
      icon: <SchoolIcon />,
      children: [
        { segment: 'reservas', title: 'Reservas', icon: <EventIcon /> },
        { segment: 'labsdocente', title: 'Laboratorios', icon: <BiotechIcon /> },
      ],
    },
  ],
  alumno: [
    { segment: 'Inicio', title: 'Inicio', icon: <SchoolIcon /> },
    {
      segment: 'asistencias',
      title: 'Asistencias',
      icon: <PeopleAltIcon />,
      children: [
        { segment: 'ver_asistencias', title: 'Ver Asistencias', icon: <ManageSearchIcon /> },
      ],
    },
    {
      segment: 'notas',
      title: 'Notas',
      icon: <HistoryEduRoundedIcon />,
      children: [
        { segment: 'ver_notas', title: 'Ver Notas', icon: <ManageSearchIcon /> },
      ],
    },
  ],
  "encargado de laboratorio": [
    {
      segment: 'gestion_reservas',
      title: 'Gestion Reservas Laboratorio',
      icon: <SchoolIcon />,
      children: [
        { segment: 'reservas', title: 'Reservas', icon: <EventIcon /> },
        { segment: 'labs', title: 'Laboratorios', icon: <BiotechIcon /> },
        { segment: 'horarios', title: 'Horarios', icon: <AlarmIcon /> },
      ],
    },
  ],
};
const DashboardLayoutAccount = () => {
  const location = useLocation(); // Usamos useLocation para obtener la ruta actual
  const navigate = useNavigate();
  const [session, setSession] = useState(() => {
    const usuarioGuardado = JSON.parse(sessionStorage.getItem('usuario'));
    return usuarioGuardado ? { user: usuarioGuardado, role: usuarioGuardado.rol } : null;
  });

  useEffect(() => {
    if (!session || !session.user) {
      navigate('/auth'); // Redirigir si no está logueado
    }
  }, [session, navigate]);

  const navigation = React.useMemo(() => {
    if (session?.role) {
      return NAVIGATION_BY_ROLE[session.role.toLowerCase()] || [];
    }
    return [];
  }, [session]);

  const handleLogout = async () => {
    try {
      logout();  // Llama a tu función logout desde auth.service.js
      sessionStorage.removeItem('usuario');
      navigate('/auth');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleLogoClick = () => {
    navigate('/inicio');
  };

  // Verificamos si estamos en la ruta "/cursos"
  if (location.pathname === '/cursos') {
    return <Outlet />;  // Solo renderizamos el contenido de la ruta sin el layout
  }

  // Función para renderizar los enlaces de navegación
  const renderNavLinks = (navigation) => {
    return navigation.map((item) => (
      <div key={item.segment}>
        {/* Enlace del padre que no navega, solo se despliega el menú */}
        <div
          className={`block p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded cursor-pointer`}
          onClick={(e) => e.preventDefault()} // Evita que navegue al hacer clic en el padre
        >
          <div className="flex items-center space-x-2">
            {item.icon}
            <span className="text-sm font-medium">{item.title}</span>
          </div>
        </div>
  
        {/* Si tiene submenú (children), renderizamos los subenlaces */}
        {item.children && (
          <div className="pl-4 space-y-2">
            {item.children.map((child) => (
              <Link
                key={child.segment}
                to={`/${item.segment.toLowerCase()}/${child.segment.toLowerCase()}`}
                className="block p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
              >
                <div className="flex items-center space-x-2">
                  {child.icon}
                  <span className="text-xs font-medium">{child.title}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="flex flex-col w-64 px-5 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700">
        <div 
          className="flex justify-center items-center mb-6 space-x-2 cursor-pointer"
          onClick={handleLogoClick}
        >
          <img className="w-auto h-7" src={logo} alt="Logo" />
          <span className="text-xl font-semibold text-gray-800 dark:text-white cursor-pointer">
            SmeBook
          </span>
        </div>
  
        <div className="flex flex-col justify-between flex-1 mt-6">
          <nav className="flex-1 -mx-3 space-y-3">
            {renderNavLinks(navigation)}
          </nav>
  
          <div className="mt-6">
            <div className="flex items-center justify-between mt-6">
              {/* Enlace de perfil */}
              <Link to="/perfil" className="flex items-center gap-x-2">
                <img
                  className="object-cover rounded-full h-7 w-7"
                  src={session?.user?.avatar || "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&h=634&q=80"}
                  alt="avatar"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {session?.user?.nombre ? `${session.user.nombre} ${session.user.apellido}` : "Cargando..."}
                  </span>
                  <br />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {session?.role ? ` ${session.role}` : "Cargando rol..."}
                  </span>
                </div>
              </Link>
  
              {/* Botón de Logout */}
              <button
                onClick={handleLogout}
                className="text-gray-500 transition-colors duration-200 rotate-180 dark:text-gray-400 rtl:rotate-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 12H3.75M12 5.25l-7.5 7.5 7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </aside>
  
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-800 p-4">
        <Outlet />  {/* Aquí se renderiza el contenido de las rutas hijas */}
      </main>
    </div>
  );
};

export default DashboardLayoutAccount;
