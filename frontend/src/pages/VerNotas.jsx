import { useState, useEffect, useContext } from 'react';
import { CursoContext } from '@context/CursoContext';
import useNotasCurso from '@hooks/notas/useNotas';
import { deleteNota, updateNota } from '@services/notas.service';
import TableComponent from '../components/TableNotas';

const VerNotas = () => {
  const { idCurso } = useContext(CursoContext);
  const { notas, fetchNotas } = useNotasCurso(idCurso);
  const [filterText, setFilterText] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [notaToDelete, setNotaToDelete] = useState(null);
  const [notaToEdit, setNotaToEdit] = useState(null);

  useEffect(() => {
    if (idCurso) fetchNotas();
  }, [idCurso, fetchNotas]);

  const filteredNotas = notas.filter((nota) =>
    `${nota.nombre_alumno.toLowerCase()} ${nota.apellido_alumno.toLowerCase()}`.includes(filterText.toLowerCase())
  );

  const handleFilterChange = (e) => setFilterText(e.target.value);

  const handleDelete = (id) => {
    setNotaToDelete(id);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (notaToDelete) {
        await deleteNota(notaToDelete);
        fetchNotas();
      }
    } catch (error) {
      console.error('Error al eliminar la nota:', error);
    } finally {
      setConfirmDialogOpen(false);
    }
  };
  const handleEdit = (nota) => {
    setNotaToEdit({ id_nota: nota.id_nota, valor: nota.valor, tipo: nota.tipo });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { id_nota, valor, tipo } = notaToEdit;
  

      if (valor < 1.0 || valor > 7.0) {
        alert('El valor de la nota debe estar entre 1.0 y 7.0');
        return;
      }
  
      if (!id_nota || valor === undefined) {
        console.error('ID o Valor no definido.');
        return;
      }
  
      await updateNota(id_nota, valor, tipo); 
      fetchNotas();
      setNotaToEdit(null);
    } catch (error) {
      console.error('Error al actualizar la nota:', error);
    }
  };

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800">
      <input
        type="text"
        value={filterText}
        onChange={handleFilterChange}
        placeholder="Filtrar por nombre del alumno..."
        className="w-full p-2 mb-4 border rounded dark:text-gray-300 dark:bg-gray-900"
      />

      <TableComponent
        notas={filteredNotas}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {confirmDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-8 rounded-lg shadow-xl bg-white text-black dark:bg-[#111827] dark:text-white w-96">
            <div className="flex items-center justify-center mb-6">
              <h2 className="text-lg font-bold">¿Estás seguro de que quieres eliminar esta nota?</h2>
            </div>
            <p className="text-base mb-6 mt-6">
              Esta acción no se puede deshacer. Confirma tu decisión.
            </p>
            <div className="flex justify-around mt-6">
              <button
                onClick={handleConfirmDelete}
                className="px-6 py-3 bg-red-600 text-white rounded-lg"
              >
                Eliminar
              </button>
              <button
                onClick={() => setConfirmDialogOpen(false)}
                className="px-6 py-3 bg-gray-400 text-white rounded-lg"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

{notaToEdit && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="p-8 rounded-lg shadow-xl bg-white text-black dark:bg-[#111827] dark:text-white w-96">
      <h2 className="text-lg font-bold mb-4">Editar Nota</h2>
      <form onSubmit={handleUpdate}>
        {/* Tipo */}
        <div className="mb-4">
          <label
            htmlFor="tipo"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Tipo
          </label>
          <select
            id="tipo"
            value={notaToEdit.tipo} // Asegúrate de que `notaToEdit.tipo` esté siempre actualizado
            onChange={(e) => setNotaToEdit((prevState) => ({ ...prevState, tipo: e.target.value }))}
            className="w-full p-2 border rounded dark:text-gray-300 dark:bg-gray-900"
          >
            <option value="Prueba">Prueba</option>
            <option value="Presentacion">Presentación</option>
            <option value="Test">Test</option>
            <option value="Tarea">Tarea</option>
          </select>
        </div>

        {/* Valor */}
        <div className="mb-4">
          <label
            htmlFor="valor"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Valor
          </label>
          <input
            type="number"
            id="valor"
            value={notaToEdit.valor}
            onChange={(e) => setNotaToEdit((prevState) => ({ ...prevState, valor: parseFloat(e.target.value) }))}
            min="1.0" 
            max="7.0" 
            step="0.1" 
            className="w-full p-2 border rounded dark:text-gray-300 dark:bg-gray-900"
          />
        </div>

        <button
          type="submit"
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg"
        >
          Actualizar
        </button>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default VerNotas;