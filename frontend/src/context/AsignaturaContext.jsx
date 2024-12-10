import { createContext, useState, useEffect } from 'react';

// Crear el contexto
export const AsignaturaContext = createContext();

// Crear el proveedor del contexto
export const AsignaturaProvider = ({ children }) => {
  // Recupera el idAsignatura desde localStorage al cargar la aplicación
  const [idAsignatura, setIdAsignatura] = useState(() => {
    const savedAsignatura = localStorage.getItem('idAsignatura');
    return savedAsignatura ? JSON.parse(savedAsignatura) : null;
  });

  // Guarda el idAsignatura en localStorage cuando cambie
  useEffect(() => {
    if (idAsignatura) {
      localStorage.setItem('idAsignatura', JSON.stringify(idAsignatura));
    }
  }, [idAsignatura]);

  return (
    <AsignaturaContext.Provider value={{ idAsignatura, setIdAsignatura }}>
      {children}
    </AsignaturaContext.Provider>
  );
};