import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AppProvider } from '@toolpad/core/react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import AddIcon from '@mui/icons-material/Add';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useNavigate, Outlet } from "react-router-dom";
import { logout } from '@services/auth.service.js';
import Add from '@mui/icons-material/Add';

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
    ]
  },
  {
    segment: 'VerNotas',
    title: 'Notas',
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
  {
    segment: 'reservas', // Añade el segmento para Reservas
    title: 'Reservas',
    icon: <SchoolIcon />,
  }
];

const customTheme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        background: {
          default: '#FFF',
          paper: '#EEEEF9',
        },
        defaultChannel: '255 255 255',
      },
    },
    dark: {
      palette: {
        background: {
          default: 'radial-gradient(circle,#090B11 , #002952)',
          paper: '#002952',
        },
        defaultChannel: '9 11 17',
      },
    },
  },
});

function DashboardLayoutAccount() {
  const navigate = useNavigate();

  // Cargar usuario de sessionStorage al iniciar sesión
  const [session, setSession] = React.useState(() => {
    const usuarioGuardado = JSON.parse(sessionStorage.getItem('usuario'));
    return usuarioGuardado ? { user: usuarioGuardado } : null;
  });

  // Redirige al usuario si no está autenticado
  React.useEffect(() => {
    if (!session || !session.user) {
      navigate('/auth');
    }
  }, [session, navigate]);

  const authentication = React.useMemo(() => {
    return {
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
    };
  }, [navigate]);

  const hideNavigation = location.pathname === '/Cursos';

  return (
    <ThemeProvider theme={customTheme}>
      <Box sx={{ minHeight: '100vh', background: (theme) => theme.palette.background.default }}>
        <AppProvider
          session={session}
          authentication={authentication}
          navigation={NAVIGATION}
          theme={customTheme}
          branding={{
            logo: <SchoolIcon sx={{ marginX: 2, marginTop: 1 }} />,
            title: "SmeBook", // Deja esto como un string
          }}
        >
          <DashboardLayout hideNavigation={hideNavigation} >
            <Outlet />
          </DashboardLayout>
        </AppProvider>
      </Box>
    </ThemeProvider>
  );
}

DashboardLayoutAccount.propTypes = {
  window: PropTypes.func,
};

export default DashboardLayoutAccount;