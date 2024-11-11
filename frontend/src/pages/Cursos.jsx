
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const cursos = [
  { id: 1, nombre: 'Matemáticas', descripcion: 'Curso básico de matemáticas.' },
  { id: 2, nombre: 'Ciencias', descripcion: 'Introducción a las ciencias naturales.' },
  { id: 3, nombre: 'Historia', descripcion: 'Historia mundial desde el siglo XVIII.' },
];

function Cursos() {
  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Página de Cursos
      </Typography>
      <List>
        {cursos.map((curso) => (
          <ListItem key={curso.id}>
            <ListItemText
              primary={curso.nombre}
              secondary={curso.descripcion}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default Cursos;
