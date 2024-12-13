import React, { useState } from 'react';
import useLabsDocente from '../hooks/labs/useLabsDocente';
import TableLabsDocente from '../components/TableLabsDocente';

const LabsDocente = () => {
  const { labs, loading, error } = useLabsDocente();
  const [filterText, setFilterText] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'nombre', direction: 'asc' });

  const handleFilterChange = (e) => setFilterText(e.target.value);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedLabs = [...labs].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const filteredLabs = sortedLabs.filter((lab) =>
    lab.nombre.toLowerCase().includes(filterText.toLowerCase())
  );

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800 min-h-screen">
      <h1 className="text-4xl text-center text-blue-100 mb-4">Laboratorios</h1>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          value={filterText}
          onChange={handleFilterChange}
          placeholder="Filtrar por nombre"
          className="mt-2 block rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
          style={{ maxWidth: '300px' }}
        />
      </div>
      <TableLabsDocente labs={filteredLabs} handleSort={handleSort} sortConfig={sortConfig} />
    </div>
  );
};

export default LabsDocente;