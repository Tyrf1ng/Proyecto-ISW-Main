import { createContext, useState, useEffect } from 'react';

// Crear el contexto
export const AsignaturaContext = createContext();

// Crear el proveedor del contexto
export const AsignaturaProvider = ({ children }) => {
  // Recupera la asignatura seleccionada desde localStorage al cargar la aplicación
  const [asignatura, setAsignatura] = useState(() => {
    const savedAsignatura = localStorage.getItem('asignatura');
    return savedAsignatura ? JSON.parse(savedAsignatura) : { id_asignatura: null, nombre: null };
  });

  // Guarda la asignatura en localStorage cuando cambie
  useEffect(() => {
    if (asignatura.id_asignatura && asignatura.nombre) {
      localStorage.setItem('asignatura', JSON.stringify(asignatura));
    }
  }, [asignatura]);

  return (
    <AsignaturaContext.Provider value={{ asignatura, setAsignatura }}>
      {children}
    </AsignaturaContext.Provider>
  );
};
