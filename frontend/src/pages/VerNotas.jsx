import { useState, useEffect, useContext } from 'react';
import useNotasCurso from '@hooks/notas/useNotas';
import { deleteNota, updateNota } from '@services/notas.service';
import TableComponent from '../components/TableNotas';
import { UsuarioContext } from '@context/UsuarioContext';
import SuccessAlert from '@components/SuccessAlert';
import ErrorAlert from '@components/ErrorAlert';

const VerNotas = () => {
  const { usuario, cargarUsuario } = useContext(UsuarioContext);
  const { notas, fetchNotas } = useNotasCurso([]);
  const [filterText, setFilterText] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [notaToDelete, setNotaToDelete] = useState(null);
  const [notaToEdit, setNotaToEdit] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 3000); 
  
      return () => clearTimeout(timer); 
    }
  }, [successMessage, errorMessage]);

  useEffect(() => {
    if (!usuario) {
      cargarUsuario();
    }
  }, [usuario, cargarUsuario]);

  if (!usuario) {
    return <div>Cargando usuario...</div>;
  }

  const handleFilterChange = (e) => setFilterText(e.target.value);

  const handleDelete = (id) => {
    setNotaToDelete(id);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setSuccessMessage("");
    try {
      if (notaToDelete) {
        await deleteNota(notaToDelete);
        setSuccessMessage("Nota borrada correctamente");
        fetchNotas();
      }
    } catch (error) {
      console.error('Error al eliminar la nota:', error);
    } finally {
      setConfirmDialogOpen(false);
    }
  };

  const handleEdit = (nota) => {
    setNotaToEdit({
      id_nota: nota.id_nota,
      valor: nota.valor || 0,
      tipo: nota.tipo || "Prueba",
      originalTipo: nota.tipo || "Prueba",
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setErrorMessage(""); 
    setSuccessMessage("");
  
    try {
      const { id_nota, valor, tipo } = notaToEdit;
  
      if (!id_nota || typeof valor !== "number" || isNaN(valor)) {
        setErrorMessage("Los datos de la nota no son válidos.");
        return;
      }
  
      const valorNumerico = parseFloat(valor);
      const decimalPart = valor.toString().split('.')[1];
  
      if (isNaN(valorNumerico) || valorNumerico < 2.0 || valorNumerico > 7.0 || (decimalPart && decimalPart.length > 1)) {
        setErrorMessage("El valor de la nota debe estar entre 2.0 y 7.0 y tener como máximo un decimal.");
        return;
      }
  
      await updateNota(id_nota, { valor, tipo });
      setSuccessMessage("Nota actualizada correctamente");
      fetchNotas(); // Actualiza las notas
      setNotaToEdit(null); // Cierra el modal
    } catch (error) {
      console.error("Error al actualizar la nota:", error);
      setErrorMessage("Hubo un problema al actualizar la nota");
    }
  };

  //Filtrado de  de notas por nombre o apellido del alumno considerando tildes y mayúsculas
  const normalizeText = (text) =>
    text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const filteredNotas = notas.filter((nota) => {
    const usuario = nota.usuario || { nombre: "", apellido: "" };
    const sanitizedFilterText = normalizeText(filterText)
      .replace(/[^a-zA-Z\s]/g, "")
      .toLowerCase();
    
    const matchesText = normalizeText(
      `${usuario.nombre} ${usuario.apellido}`
    )
      .toLowerCase()
      .includes(sanitizedFilterText);
      return matchesText
  });
  
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800">
      <input
        type="text"
        value={filterText}
        onChange={handleFilterChange}
        placeholder="Filtrar por nombre o apellido del alumno..."
        className="w-full p-2 mb-4 border rounded dark:text-gray-300 dark:bg-gray-900"
      />
  
      {successMessage && <SuccessAlert message={successMessage} />}
      {errorMessage && <ErrorAlert message={errorMessage} />}
  
      <TableComponent
        notas={filteredNotas}
        onEdit={handleEdit}
        onDelete={handleDelete}
        role={usuario?.rol}
      />
  
      {confirmDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
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
  
      {notaToEdit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-8 rounded-lg shadow-xl bg-white text-black dark:bg-[#111827] dark:text-white w-96">
            <h2 className="text-lg font-bold mb-4">Editar Nota</h2>
            {errorMessage && <ErrorAlert message={errorMessage} />}
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label
                  htmlFor="tipo"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Tipo
                </label>
                <select
                  id="tipo"
                  value={notaToEdit?.tipo || ''}
                  onChange={(e) =>
                    setNotaToEdit((prevState) => ({
                      ...prevState,
                      tipo: e.target.value,
                    }))
                  }
                  className="w-full p-2 border rounded dark:text-gray-300 dark:bg-gray-900"
                >
                  <option value="Prueba">Prueba</option>
                  <option value="Presentacion">Presentación</option>
                  <option value="Test">Test</option>
                  <option value="Tarea">Tarea</option>
                </select>
              </div>
  
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
                  value={notaToEdit?.valor || ''}
                  onChange={(e) =>
                    setNotaToEdit((prevState) => ({
                      ...prevState,
                      valor: parseFloat(e.target.value) || 0,
                    }))
                  }
                  min="2.0"
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
              <button
                type="button"
                onClick={() => setNotaToEdit(null)}
                className="w-full px-6 py-3 bg-red-500 text-white rounded-lg mt-4"
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
