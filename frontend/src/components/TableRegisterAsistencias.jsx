import { useEffect, useState } from 'react';

const TableRegisterAsistencias = ({ students, handleRegister }) => {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    setAttendance(
      students.map((student) => ({
        rut: student.rut,
        nombre: `${student.nombre} ${student.apellido}`,
        presente: false,
        ausente: false,
        justificado: false,
        observacion: ''
      }))
    );
  }, [students]);

  const handleCheckboxChange = (rut, type) => {
    setAttendance((prevAttendance) =>
      prevAttendance.map((record) => {
        if (record.rut === rut) {
          return {
            ...record,
            presente: type === 'presente' ? !record.presente : false,
            ausente: type === 'ausente' ? !record.ausente : false,
            justificado: type === 'justificado' ? !record.justificado : false,
            observacion: type === 'justificado' && !record.justificado ? record.observacion : ''
          };
        }
        return record;
      })
    );
  };

  const handleObservationChange = (rut, value) => {
    setAttendance((prevAttendance) =>
      prevAttendance.map((record) => {
        if (record.rut === rut) {
          return { ...record, observacion: value };
        }
        return record;
      })
    );
  };

  const handleSave = () => {
    handleRegister(attendance);
  };

  return (
    <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
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
                      {student.rut}
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
                    />
                  </td>
                  <td className="px-4 py-4 text-sm whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={student.ausente}
                      onChange={() => handleCheckboxChange(student.rut, 'ausente')}
                    />
                  </td>
                  <td className="px-4 py-4 text-sm whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={student.justificado}
                      onChange={() => handleCheckboxChange(student.rut, 'justificado')}
                    />
                    {student.justificado && (
                      <div className="mt-2">
                        <textarea
                          className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300"
                          rows="2"
                          placeholder="Escribe una observación..."
                          value={student.observacion}
                          onChange={(e) => handleObservationChange(student.rut, e.target.value)}
                        />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <button onClick={handleSave} className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg text-lg">
        Guardar Asistencias
      </button>
    </div>
  );
};

export default TableRegisterAsistencias;