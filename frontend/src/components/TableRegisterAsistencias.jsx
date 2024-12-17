import React from 'react';
import { prettifyRut } from 'react-rut-formatter';
import useTablaRegisterAsistencia from '../hooks/Asistencias/useTableRegisterAsistencias';

const TableRegisterAsistencias = ({ students, handleRegister }) => {
  const {
    attendance,
    allPresent,
    setAllPresent,
    allAbsent,
    setAllAbsent,
    handleCheckboxChange,
    handleObservationChange,
    handleSave
  } = useTablaRegisterAsistencia(students, handleRegister);

  return (
    <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="flex justify-between p-4 ml-3">
        <div>
          <label className="mr-4 text-gray-800 text-xs ml-2">
            <input
              type="checkbox"
              checked={allPresent}
              onChange={() => setAllPresent(!allPresent)}
              className="mr-2"
            />
            Todos Presentes
          </label>
          <label className="mr-4 text-gray-800 text-xs ml-2">
            <input
              type="checkbox"
              checked={allAbsent}
              onChange={() => setAllAbsent(!allAbsent)}
              className="mr-2"
            />
            Todos Ausentes
          </label>
        </div>
      </div>
      <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
        <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  RUT
                </th>
                <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  Nombre
                </th>
                <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  Presente
                </th>
                <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  Ausente
                </th>
                <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  Justificado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
              {attendance.map((student) => (
                <tr key={student.rut}>
                  <td className="px-4 py-4 text-sm whitespace-nowrap">
                    <div className="text-gray-800 dark:text-white">
                      {prettifyRut(student.rut)}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm whitespace-nowrap">
                    <div className="text-gray-800 dark:text-white">
                      {student.nombre}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={student.presente}
                      onChange={() => handleCheckboxChange(student.rut, 'presente')}
                      className="mr-2"
                    />
                  </td>
                  <td className="px-4 py-4 text-sm whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={student.ausente}
                      onChange={() => handleCheckboxChange(student.rut, 'ausente')}
                      className="mr-2"
                    />
                  </td>
                  <td className="px-4 py-4 text-sm whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={student.justificado}
                      onChange={() => handleCheckboxChange(student.rut, 'justificado')}
                      className="mr-2"
                    />
                    {student.justificado && (
                      <div className="mt-2">
                        <textarea
                          className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 mt-2 resize-none"
                          rows="2"
                          placeholder="Escribe una observación... (máx. 60 caracteres)"
                          value={student.observacion}
                          onChange={(e) => handleObservationChange(student.rut, e.target.value)}
                          maxLength={60}
                        />
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {60 - student.observacion.length} caracteres restantes
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <button onClick={handleSave} className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg text-lg ml-8">
        Guardar Asistencias
      </button>
    </div>
  );
};

export default TableRegisterAsistencias;
