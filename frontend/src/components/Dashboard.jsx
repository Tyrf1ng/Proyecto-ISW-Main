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

const NAVIGATION = [
  {
    segment: 'Inicio',
    title: 'Inicio',
    icon: <SchoolIcon />,
  },
  {
    segment: 'Cursos',
    title: 'Cursos',
    icon: <SchoolIcon />,
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
      /*{
        segment: 'add',
        title: 'Añadir notas',
        icon: <AddIcon />,
      },*/
      {
        segment: 'Ver',
        title: 'Ver todas las notas',
        icon: <ManageSearchIcon />,
      },
    ],
  
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
  {
    segment: 'reservas',
    title: 'Reservas',
    icon: <SchoolIcon />,
  },
];

const customTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: {
    light: {
      palette: {
        background: {
          default: '#FFF',
          paper: '#EEEEF9',
        },
        primary: {
          main: '#1976d2',
        },
        secondary: {
          main: '#9c27b0',
        },
      },
    },
    dark: {
      palette: {
        background: {
          default: 'radial-gradient(circle,#090B11 , #002952)',
          paper: '#002952',
        },
        primary: {
          main: '#90caf9',
        },
        secondary: {
          main: '#f48fb1',
        },
        text: {
          primary: '#ffffff',
          secondary: '#bbbbbb',
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DashboardLayoutAccount() {
  const navigate = useNavigate();

  const [session, setSession] = React.useState(() => {
    const usuarioGuardado = JSON.parse(sessionStorage.getItem('usuario'));
    return usuarioGuardado ? { user: usuarioGuardado } : null;
  });

  React.useEffect(() => {
    if (!session || !session.user) {
      navigate('/auth');
    }
  }, [session, navigate]);

  const authentication = React.useMemo(() => ({
    signIn: () => {
      const user = {
        email: 'example@domain.com',
        image: 'https://example.com/image.jpg',
      };
      sessionStorage.setItem('usuario', JSON.stringify(user));
      setSession({ user });
    },
    signOut: () => {
      logout();
      sessionStorage.removeItem('usuario');
      setSession(null);
      navigate('/auth');
    },
  }), [navigate]);

  const hideNavigation = location.pathname === '/Cursos';

  return (
    <AppProvider
      session={session}
      authentication={authentication}
      navigation={NAVIGATION}
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
