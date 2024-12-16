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
import AlarmIcon from '@mui/icons-material/Alarm';
import BiotechIcon from '@mui/icons-material/Biotech';
import EventIcon from '@mui/icons-material/Event';
import logo from '../images/components/logo.svg'; 

const NAVIGATION_BY_ROLE = {
  directivo: [
    { segment: 'GestionUsuario', title: 'Gestión de Alumnos', 
      icon: <SchoolIcon />,
      children: [
        { segment: 'add_usuario', title: 'Añadir usuario', icon: <AddIcon /> },
        { segment: 'ver_usuarios', title: 'Ver todos los usuarios', icon: <ManageSearchIcon /> },
        { segment: 'add_docente', title: 'Añadir Docente', icon: <AddIcon /> },
        { segment: 'ver_docentes', title: 'Ver todos los docentes', icon: <ManageSearchIcon /> },
        { segment: 'add_enc_lab', title: 'Añadir Encargado de Laboratorio', icon: <AddIcon /> },
      ],
    },
    { segment: 'Estadisticas', title: 'Gestión de Usuarios', 
      icon: <SchoolIcon />,
      children: [
        { segment: 'estad_docentes', title: 'Estadisticas docente', icon: <AddIcon /> },
      ],
    },
  ],
  docente: [
    {
      segment: 'asistencias',
      title: 'Asistencias',
      icon: <PeopleAltIcon />,
      children: [
        { segment: 'RegisterAsistencias', title: 'Registrar Asistencias', icon: <AddIcon /> },
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
        { segment: "add", title: "Añadir Notas", icon: <AddIcon /> },
        { segment: 'ver_notas', title: 'Ver Notas', icon: <ManageSearchIcon /> },
      ],
    },
    {
      segment: 'gestion_reservas',
      title: 'Gestion Reservas Laboratorio',
      icon: <SchoolIcon />,
      children: [
        { segment: 'add_reservadocente', title: 'Añadir Reservas', icon: <AddIcon /> },
        { segment: 'ver_reservasdocentes', title: 'Mis Reservas', icon: <EventIcon /> }, // Actualizar para apuntar a ReservasDocentes
        { segment: 'labsdocente', title: 'Laboratorios', icon: <BiotechIcon /> },
      ],
    },
  ],
  alumno: [
    {
      segment: 'asistencias',
      title: 'Asistencias',
      icon: <PeopleAltIcon />,
      children: [
        { segment: 'ver_asistencias', title: 'Ver Asistencias', icon: <ManageSearchIcon /> },
      ],
    },
    {
      segment: 'anotaciones',
      title: 'Anotaciones',
      icon: <HistoryEduRoundedIcon />,
      children: [
        { segment: 'alumno', title: 'Ver Anotaciones', icon: <ManageSearchIcon /> },
      ],
    },
    {
      segment: 'notas',
      title: 'Notas',
      icon: <HistoryEduRoundedIcon />,
      children: [
        { segment: 'Ver_Nota_Alumno', title: 'Ver Notas', icon: <ManageSearchIcon /> },
      ],
    },
  ],
  "encargado de laboratorio": [
    {
      segment: 'gestion_reservas',
      title: 'Gestion Reservas Laboratorio',
      icon: <SchoolIcon />,
      children: [
        { segment: 'add_reserva', title: 'Añadir Reservas', icon: <AddIcon /> },
        { segment: 'ver_reservas', title: 'Ver Reservas', icon: <EventIcon /> },
        { segment: 'labs', title: 'Laboratorios', icon: <BiotechIcon /> },
        { segment: 'horarios', title: 'Horarios', icon: <AlarmIcon /> },
      ],
    },
  ],
};

const DashboardLayoutAccount = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useState(() => {
    const usuarioGuardado = JSON.parse(sessionStorage.getItem('usuario'));
    return usuarioGuardado ? { user: usuarioGuardado, role: usuarioGuardado.rol } : null;
  });
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  useEffect(() => {
    if (!session || !session.user) {
      navigate('/auth');
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
      logout();
      sessionStorage.removeItem('usuario');
      navigate('/auth');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleLogoClick = () => {
    navigate('/inicio');
  };

  if (location.pathname === '/cursos' || location.pathname === '/asignaturas') {
    return <Outlet />;
  }

  const renderNavLinks = (navigation) => {
    return navigation.map((item) => (
      <div key={item.segment}>
        <div
          className={`block p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded cursor-pointer`}
          onClick={(e) => e.preventDefault()}
        >
          <div className="flex items-center space-x-2">
            {item.icon}
            <span className="text-sm font-medium">{item.title}</span>
          </div>
        </div>
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
    <>
      <div className="flex h-screen">
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
              <div className="flex items-center justify-between px-5 mt-6">
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {session?.user?.nombre ? `${session.user.nombre} ${session.user.apellido}` : "Cargando..."}
                  </span>
                  <br />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {session?.role ? ` ${session.role}` : "Cargando rol..."}
                  </span>
                </div>
                <button
                onClick={() => setConfirmDialogOpen(true)}
                className="text-gray-500 transition-colors duration-200 rotate-180 dark:text-gray-400 rtl:rotate-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 transform rotate-180">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12h13.5M12 5.25l7.5 7.5-7.5 7.5" />
                </svg>

              </button>
              </div>
            </div>
          </div>
        </aside>
        <main className="flex-1 p-6 overflow-y-auto bg-gray-100 dark:bg-gray-800">
          <Outlet />
        </main>
      </div>

      {/* Dialogo de confirmación para cerrar sesión */}
      {confirmDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-sm w-full p-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Cerrar sesión</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                ¿Estás seguro de que deseas cerrar sesión?
              </p>
              <div className="mt-4 flex justify-center space-x-3">
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
                >
                  Sí
                </button>
                <button
                  onClick={() => setConfirmDialogOpen(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardLayoutAccount;
