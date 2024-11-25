import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ClassIcon from '@mui/icons-material/Class';
import { AppProvider } from '@toolpad/core/AppProvider';
import SchoolIcon from '@mui/icons-material/School';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import { useNavigate } from "react-router-dom";
import { logout } from '@services/auth.service.js';

const NAVIGATION = [
  {
    segment: 'inicio',
    title: 'Inicio',
    icon: <DashboardIcon />,
  },
  {
    segment: 'cursos',
    title: 'Cursos',
    icon: <ClassIcon />,
  },
  {
    segment: 'anotaciones',
    title: 'Anotaciones',
    icon: <ClassIcon />,
  },
  {
    segment: 'notas',
    title: 'Notas',
    icon: <ClassIcon />,
  },
  {
    segment: 'asignaturas',
    title: 'Asignaturas',
    icon: <ClassIcon />,
  },
  {
    segment: 'alumnos',
    title: 'Alumnos',
    icon: <ClassIcon />,
  },
  {
    segment: 'apoderados',
    title: 'Apoderados',
    icon: <ClassIcon />,
  },
  {
    segment: 'docentes',
    title: 'Docentes',
    icon: <ClassIcon />,
  },
  {
    segment: 'directivos',
    title: 'Directivos',
    icon: <ClassIcon />,
  },
  {
    segment: 'roles',
    title: 'Roles',
    icon: <ClassIcon />,
  },
  {
    segment: 'usuarios',
    title: 'Usuarios',
    icon: <ClassIcon />,
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
        defaultChannel: '255 255 255', // Agrega esto en formato RGB
      },
    },
    dark: {
      palette: {
        background: {
          default: 'radial-gradient(circle,#090B11 , #002952)',
          paper: '#002952',
        },
        defaultChannel: '9 11 17', // Agrega esto en formato RGB
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


function DemoPageContent({ pathname }) {
  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Typography>Dashboard content for {pathname}</Typography>
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function Home(props) {
  const { window } = props;
  const navigate = useNavigate();

  // Cargar usuario de sessionStorage al iniciar sesión
  const [session, setSession] = React.useState(() => {
    const usuarioGuardado = JSON.parse(sessionStorage.getItem('usuario'));
    return usuarioGuardado ? { user: usuarioGuardado } : null;
  });

  const authentication = React.useMemo(() => {
    return {
      signIn: () => {
        const user = {
          email: 'bharatkashyap@outlook.com',
          image: 'https://avatars.githubusercontent.com/u/19550456',
        };
        sessionStorage.setItem('usuario', JSON.stringify(user));
        setSession({ user });
      },
      signOut: () => {
        logout();
        sessionStorage.removeItem('usuario');
        setSession(null);
        navigate('/auth'); // Redirigir a la página de autenticación después de cerrar sesión
      },
    };
  }, [navigate]);

  const router = useDemoRouter('/');
  const demoWindow = window !== undefined ? window() : undefined;

  return (
    <ThemeProvider theme={customTheme}>
      <Box
        sx={{
          minHeight: '100vh',
          background:' #E6EFF8',
        }}
      >
        <Typography sx={{ color: '#000' }}>Hola!</Typography>
      </Box>
    </ThemeProvider>
  );
}

Home.propTypes = {
  window: PropTypes.func,
};

export default Home;