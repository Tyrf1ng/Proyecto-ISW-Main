import { createContext, useState, useEffect } from 'react';

// Crear el contexto
export const AsignaturaContext = createContext();

// Crear el proveedor del contexto
export const AsignaturaProvider = ({ children }) => {
  // Recupera el idAsignatura desde localStorage al cargar la aplicación
  const [asignatura, setAsignatura] = useState(() => {
    const savedAsignatura = localStorage.getItem('asignatura');
    return savedAsignatura ? JSON.parse(savedAsignatura) : { idAsignatura: null, nombre: null };
  });

  // Guarda el idAsignatura en localStorage cuando cambie
  useEffect(() => {
    if (asignatura.idAsignatura && asignatura.nombre) {
      localStorage.setItem('asignatura', JSON.stringify(asignatura));
    }
  }, [asignatura]);

  return (
    <AsignaturaContext.Provider value={{ asignatura, setAsignatura }}>
      {children}
    </AsignaturaContext.Provider>
  );
};