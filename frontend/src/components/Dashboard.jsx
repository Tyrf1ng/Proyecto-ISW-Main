import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import { createTheme } from '@mui/material/styles';
import { AppProvider } from '@toolpad/core/react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import HistoryEduRoundedIcon from '@mui/icons-material/HistoryEduRounded';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import AddIcon from '@mui/icons-material/Add';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useNavigate, Outlet } from 'react-router-dom';
import { logout } from '@services/auth.service.js';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';

// Configuración de navegación por roles
const NAVIGATION_BY_ROLE = {
  directivo: [
    { segment: 'GestionUsuarios', title: 'Gestión de Usuarios', icon: <SchoolIcon /> },
  ],
  docente: [
    {
      segment: 'Inicio',
      title: 'Inicio',
      icon: <SchoolIcon />,
    },
    {
      segment: 'Cursos',
      title: 'Cursos',
      icon: <CollectionsBookmarkIcon />,
    },
    {
      segment: 'asistencias',
      title: 'Asistencias',
      icon: <PeopleAltIcon />,
      children: [
        {
          segment: 'add_asistencias',
          title: 'Añadir asistencias',
          icon: <AddIcon />,
        },
        {
          segment: 'ver_asistencias',
          title: 'Ver todas las asistencias',
          icon: <ManageSearchIcon />,
        },
      ],
    },
    {
      segment: 'anotaciones',
      title: 'Anotaciones',
      icon: <StickyNote2Icon />,
      children: [
        {
          segment: 'add_anotaciones',
          title: 'Añadir anotaciones',
          icon: <AddIcon />,
        },
        {
          segment: 'ver_anotaciones',
          title: 'Ver todas las anotaciones',
          icon: <ManageSearchIcon />,
        },
      ],
    },
    {
      segment: 'notas',
      title: 'Notas',
      icon: <HistoryEduRoundedIcon />,
      children: [
        {
          segment: 'Ver',
          title: 'Ver todas las notas',
          icon: <ManageSearchIcon />,
        },
      ],
    },
    {
      segment: 'gestion_reservas',
      title: 'Gestion Reservas Laboratorio',
      icon: <SchoolIcon />,
      children: [
        {
          segment: 'reservas',
          title: 'Reservas',
          icon: <SchoolIcon />,
        },
        {
          segment: 'labs',
          title: 'Laboratorios',
          icon: <SchoolIcon />,
        },
        {
          segment: 'horarios',
          title: 'Horarios',
          icon: <SchoolIcon />,
        },
      ],
    },
  ],
  alumno: [
    { segment: 'Inicio', title: 'Inicio', icon: <SchoolIcon /> },
    {
      segment: 'notas',
      title: 'Notas',
      icon: <HistoryEduRoundedIcon />,
      children: [
        { segment: 'Ver_Nota_Alumno', title: 'Ver Nota por RUT', icon: <ManageSearchIcon /> },
      ],
    },
  ],
  apoderado: [
    { segment: 'Inicio', title: 'Inicio', icon: <SchoolIcon /> },
  ],
  administrativo: [
    { segment: 'gestion_reservas', title: 'Gestión Reservas Laboratorio', icon: <SchoolIcon /> },
  ],
  encargado_laboratorio: [
    { segment: 'labs', title: 'Laboratorios', icon: <SchoolIcon /> },
    { segment: 'horarios', title: 'Horarios', icon: <SchoolIcon /> },
  ],
};

const customTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: {
    light: {
      palette: {
        background: { default: '#FFF', paper: '#EEEEF9' },
        primary: { main: '#1976d2' },
        secondary: { main: '#9c27b0' },
      },
    },
    dark: {
      palette: {
        background: { default: 'radial-gradient(circle,#090B11 , #002952)', paper: '#002952' },
        primary: { main: '#90caf9' },
        secondary: { main: '#f48fb1' },
        text: { primary: '#ffffff', secondary: '#bbbbbb' },
      },
    },
  },
  breakpoints: {
    values: { xs: 0, sm: 600, md: 600, lg: 1200, xl: 1536 },
  },
});

function DashboardLayoutAccount() {
  const navigate = useNavigate();

  // Recupera la sesión desde sessionStorage
  const [session, setSession] = React.useState(() => {
    const usuarioGuardado = JSON.parse(sessionStorage.getItem('usuario'));
    return usuarioGuardado ? { user: usuarioGuardado, role: usuarioGuardado.rol } : null;
  });

  React.useEffect(() => {
    if (!session || !session.user) {
      navigate('/auth');
    }
  }, [session, navigate]);

  // Funciones de autenticación
  const authentication = React.useMemo(() => ({
    signIn: () => {
      const user = {
        email: 'example@domain.com',
        image: 'https://example.com/image.jpg',
        role: 'user',
      };
      sessionStorage.setItem('usuario', JSON.stringify(user));
      setSession({ user, role: user.role });
    },
    signOut: () => {
      logout();
      sessionStorage.removeItem('usuario');
      setSession(null);
      navigate('/auth');
    },
  }), [navigate]);

  // Configura la navegación según el rol
  const navigation = React.useMemo(() => {
    if (session?.role) {
      return NAVIGATION_BY_ROLE[session.role.toLowerCase()] || [];
    }
    return [];
  }, [session]);

  const hideNavigation = location.pathname === '/Cursos';

  return (
    <AppProvider
      session={session}
      authentication={authentication}
      navigation={navigation} // Navegación basada en el rol
      branding={{
        logo: <SchoolIcon sx={{ marginX: 2, marginTop: 1 }} />,
        title: 'SmeBook',
      }}
      theme={customTheme}
    >
      <Box sx={{ minHeight: '100vh', background: (theme) => theme.palette.background.default }}>
        <DashboardLayout hideNavigation={hideNavigation}>
          <Outlet />
        </DashboardLayout>
      </Box>
    </AppProvider>
  );
}

DashboardLayoutAccount.propTypes = {
  window: PropTypes.func,
};

export default DashboardLayoutAccount;
