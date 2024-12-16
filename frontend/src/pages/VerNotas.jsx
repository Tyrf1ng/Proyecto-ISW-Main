import { useState } from 'react';
import useNotasCurso from '@hooks/notas/useNotas';
import { deleteNota, updateNota } from '@services/notas.service';
import TableComponent from '../components/TableNotas';
import useUsuario from '@hooks/useUsuario';
import SuccessAlert from '@components/SuccessAlert';
import ErrorAlert from '@components/ErrorAlert';
import useAlert from '@hooks/useAlerts';


const VerNotas = () => {
  const [alert, showAlert] = useAlert();
  const { notas, fetchNotas } = useNotasCurso([]);
  const { usuario } = useUsuario();
  const [filterText, setFilterText] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [notaToDelete, setNotaToDelete] = useState(null);
  const [notaToEdit, setNotaToEdit] = useState(null);

//Funcion De filtrado MAX 30 caracteres y solo letras
  const handleFilterChange = (e) => {
    const inputText = e.target.value;
    if (/[^a-zA-ZñÑ\s]/.test(inputText) || inputText.length > 30) {
      return;
    }
    setFilterText(inputText);
  };

  //Funcion de eliminar nota
  const handleDelete = (id) => {
    setNotaToDelete(id);
    setConfirmDialogOpen(true);
  };

//Funcion de confirmar eliminacion y mostrar alertas
  const handleConfirmDelete = async () => {
    try {
      if (notaToDelete) {
        await deleteNota(notaToDelete);
        showAlert('success', 'Nota borrada correctamente');
        fetchNotas();
      }
    } catch (error) {
      console.error('Error al eliminar la nota:', error);
      showAlert('error', 'Error al eliminar la nota');
    } finally {
      setConfirmDialogOpen(false);
    }
  };

//Funcion de editar nota
  const handleEdit = (nota) => {
    setNotaToEdit({
      id_nota: nota.id_nota,
      valor: nota.valor || 0,
      tipo: nota.tipo || 'Prueba',
    });
  };

  //Funcion de actualizar nota
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { id_nota, valor, tipo } = notaToEdit;
      if (!id_nota || valor < 2.0 || valor > 7.0) {
        showAlert('error', 'El valor de la nota debe estar entre 2.0 y 7.0.');
        return;
      }
      await updateNota(id_nota, { valor, tipo });
      showAlert('success', 'Nota actualizada correctamente');
      fetchNotas();
      setNotaToEdit(null);
    } catch (error) {
      console.error('Error al actualizar la nota:', error);
      showAlert('error', 'Hubo un problema al actualizar la nota.');
    }
  };

  //Funcion de normalizar texto para busqueda de Alumnos por nombre o apellido
    const normalizeText = (text) =>
    text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

    const filteredNotas = notas.filter((nota) => {
    const usuario = nota.usuario || { nombre: '', apellido: '' };
    const sanitizedFilterText = normalizeText(filterText);
    return normalizeText(`${usuario.nombre} ${usuario.apellido}`).includes(sanitizedFilterText);
  });

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800">

      {/*Barra de busqueda*/}
      <input
        type="text"
        value={filterText}
        onChange={handleFilterChange}
        placeholder="Filtrar por nombre o apellido del alumno"
        className="w-96 p-2 mb-4 border rounded dark:text-gray-300 dark:bg-gray-900"
      />

      {alert.type === 'success' && <SuccessAlert message={alert.message} />}
      {alert.type === 'error' && <ErrorAlert message={alert.message} />}

  {/*Validacion de usuario y mostrar tabla*/}
      <TableComponent
        notas={filteredNotas}
        onEdit={handleEdit}
        onDelete={handleDelete}
        role={usuario?.rol}
      />

    {/*Dialogo de confirmacion de eliminacion*/}
      {confirmDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setConfirmDialogOpen(null);
            }
          }}
        >
          <div className="p-8 rounded-lg shadow-xl bg-white text-black dark:bg-[#111827] dark:text-white w-96">
            <h2 className="text-lg font-bold mb-4">Confirmar Eliminación</h2>
            <p>¿Estás seguro de que deseas eliminar esta nota?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg mr-2"
              >
                Eliminar
              </button>
              <button
                onClick={() => setConfirmDialogOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

    {/*Dialogo de edicion de nota*/}
      {notaToEdit && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setNotaToEdit(null);
            }
          }}
        >
          <div className="p-8 rounded-lg shadow-xl bg-white text-black dark:bg-[#111827] dark:text-white w-96">
            <h2 className="text-lg font-bold mb-4">Editar Nota</h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                
                {/*Campo de tipo de nota*/}
                <label htmlFor="tipo" className="block text-sm text-gray-500 dark:text-gray-300">
                  Tipo
                </label>
                <select
                  id="tipo"
                  value={notaToEdit.tipo}
                  onChange={(e) =>
                    setNotaToEdit((prevState) => ({ ...prevState, tipo: e.target.value }))
                  }
                  className="mt-2 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
                >
                  <option value="Prueba">Prueba</option>
                  <option value="Presentacion">Presentación</option>
                  <option value="Test">Test</option>
                  <option value="Tarea">Tarea</option>
                </select>
              </div>

              {/*Campo de valor de la nota*/}
              <div className="mb-4">
                <label htmlFor="valor" className="block text-sm font-medium">
                  Valor
                </label>
                <input
                  type="number"
                  id="valor"
                  value={notaToEdit.valor}
                  onChange={(e) =>
                    setNotaToEdit((prevState) => ({ ...prevState, valor: parseFloat(e.target.value) || 0 }))
                  }
                  min="2.0"
                  max="7.0"
                  step="0.1"
                  className="mt-2 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
                />
              </div>

            {/*Botones de confirmacion y cancelacion*/}
              <button type="submit" className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg">
                Actualizar
              </button>
              <button
                type="button"
                onClick={() => setNotaToEdit(null)}
                className="w-full px-6 py-3 bg-gray-400 rounded-lg mt-4"
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerNotas;
