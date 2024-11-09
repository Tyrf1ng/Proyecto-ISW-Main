import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AppProvider } from '@toolpad/core/AppProvider';
import SchoolIcon from '@mui/icons-material/School';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useNavigate, Outlet } from "react-router-dom";
import { logout } from '@services/auth.service.js';

const NAVIGATION = [
  {
    segment: 'Home',
    title: 'Inicio',
    icon: <SchoolIcon />,
  },
  {
    segment: 'cursos',
    title: 'Cursos',
    icon: <SchoolIcon />,
  },
  {
    segment: 'anotaciones',
    title: 'Anotaciones',
    icon: <SchoolIcon />,
  },
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

  const [session, setSession] = React.useState(() => {
    const usuarioGuardado = JSON.parse(sessionStorage.getItem('usuario'));
    return usuarioGuardado ? { user: usuarioGuardado } : null;
  });

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
            title: 'Aplicacion para liceo',
          }}
        >
          <DashboardLayout>
            {session && session.user ? (
              <Typography variant="h6" sx={{ p: 2 }}>
                Bienvenido
              </Typography>
            ) : (
              <Typography variant="h6" sx={{ p: 2 }}>
                No has iniciado sesión
              </Typography>
            )}
            {/* Aquí se renderizan las rutas hijas */}
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
