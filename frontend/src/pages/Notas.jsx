import React, { useEffect, useState } from 'react';
import VirtuosoTableComponents from '../components/Table';
import { TableRow, TableCell } from '@mui/material';
import axios from 'axios';

const columns = [
  { dataKey: 'id_nota', label: 'ID', numeric: true, width: 100 },
  { dataKey: 'rut_alumno', label: 'Rut del alumno', numeric: false, width: 100 },
  { dataKey: 'id_asignatura', label: 'Asignatura', numeric: true, width: 200 },
  { dataKey: 'tipo', label: 'Descripcion', numeric: false, width: 100 },
  { dataKey: 'valor', label: 'Nota', numeric: true, width: 100 },
];

function Notas() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('/api/notas')
      .then(response => {
        if (Array.isArray(response.data)) {
          setData(response.data);
        } else {
          console.error('Expected an array but got:', response.data);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  function renderTable() {
    return (
      <VirtuosoTableComponents.Scroller>
        <VirtuosoTableComponents.Table>
          <VirtuosoTableComponents.TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.dataKey}
                  variant="head"
                  align={column.numeric ? 'right' : 'left'}
                  style={{ width: column.width }}
                  sx={{ backgroundColor: 'background.paper' }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </VirtuosoTableComponents.TableHead>
          <VirtuosoTableComponents.TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
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
    <div>
      {renderTable()}
    </div>
  );
}

export default Notas;