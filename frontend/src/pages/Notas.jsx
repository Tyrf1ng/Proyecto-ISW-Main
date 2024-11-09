import React, { useEffect, useState } from 'react';
import VirtuosoTableComponents from '../components/Table';
import { TableRow, TableCell, Typography, Box, TextField } from '@mui/material';
import { AllNotas } from '../services/notas.service.js';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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
      },
    },
    dark: {
      palette: {
        background: {
          default: 'radial-gradient(circle,#090B11 , #002952)',
          paper: '#002952',
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


const columns = [
  { dataKey: 'id_nota', label: 'ID De la Nota', numeric: true, width: 100 },
  { dataKey: 'rut_alumno', label: 'Rut del alumno', numeric: false, width: 100 },
  { dataKey: 'id_asignatura', label: 'Asignatura', numeric: true, width: 200 },
  { dataKey: 'nombre_asignatura', label: 'Nombre de la Asignatura', numeric: false, width: 200 },
  { dataKey: 'tipo', label: 'Descripcion', numeric: false, width: 100 },
  { dataKey: 'valor', label: 'Nota', numeric: true, width: 100 },
];

function Notas() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [asignaturaId, setAsignaturaId] = useState('');

  const fetchAllNotas = async () => {
    try {
      const response = await AllNotas();
      setData(response.data.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching notas', error);
    }
  };

  useEffect(() => {
    fetchAllNotas();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAsignaturaIdChange = (event) => {
    setAsignaturaId(event.target.value);
  };

  const filteredData = data.filter((row) => {
    const matchesSearchTerm = columns.some((column) => {
      const cellValue = row[column.dataKey];
      return cellValue && cellValue.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });

    const matchesAsignaturaId = asignaturaId ? row.id_asignatura.toString() === asignaturaId : true;

    return matchesSearchTerm && matchesAsignaturaId;
  });

  function renderTable() {
    if (!Array.isArray(data) || data.length === 0) {
      return <Typography>No hay notas disponibles.</Typography>;
    }

    return (
      <VirtuosoTableComponents.Scroller>
        <VirtuosoTableComponents.Table sx={{ backgroundColor: 'background.paper' }}>
          <VirtuosoTableComponents.TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.dataKey}
                  variant="head"
                  align={column.numeric ? 'right' : 'left'}
                  style={{ width: column.width }}
                  sx={{ backgroundColor: 'background.paper', color: 'text.primary' }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </VirtuosoTableComponents.TableHead>
          <VirtuosoTableComponents.TableBody>
            {filteredData.map((row) => (
              <TableRow key={row.id_nota}>
                {columns.map((column) => (
                  <TableCell
                    key={column.dataKey}
                    align={column.numeric ? 'right' : 'left'}
                  >
                    {row[column.dataKey]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </VirtuosoTableComponents.TableBody>
        </VirtuosoTableComponents.Table>
      </VirtuosoTableComponents.Scroller>
    );
  }

  return (
    <ThemeProvider theme={customTheme}>
      <Box sx={{ padding: 2 }}>
        <TextField
          label="Buscar"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearch}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="ID de Asignatura"
          variant="outlined"
          fullWidth
          value={asignaturaId}
          onChange={handleAsignaturaIdChange}
          sx={{ marginBottom: 2 }}
        />
        {renderTable()}
      </Box>
    </ThemeProvider>
  );
}

export default Notas;