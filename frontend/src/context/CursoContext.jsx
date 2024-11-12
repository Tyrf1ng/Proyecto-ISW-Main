import { createContext, useState, useEffect } from 'react';

// Crear el contexto
export const CursoContext = createContext();

// Crear el proveedor del contexto
export const CursoProvider = ({ children }) => {
  // Recupera el idCurso desde localStorage al cargar la aplicación
  const [idCurso, setIdCurso] = useState(() => {
    const savedCurso = localStorage.getItem('idCurso');
    return savedCurso ? JSON.parse(savedCurso) : null;
  });

  // Guarda el idCurso en localStorage cuando cambie
  useEffect(() => {
    if (idCurso) {
      localStorage.setItem('idCurso', JSON.stringify(idCurso));
    }
  }, [idCurso]);

  return (
    <CursoContext.Provider value={{ idCurso, setIdCurso }}>
      {children}
    </CursoContext.Provider>
  );
};
