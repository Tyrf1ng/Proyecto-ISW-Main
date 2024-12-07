import { createContext, useState, useEffect } from 'react';

// Crear el contexto
export const CursoContext = createContext();

// Crear el proveedor del contexto
export const CursoProvider = ({ children }) => {
  // Recupera el idCurso y el nombre del curso desde localStorage al cargar la aplicación
  const [curso, setCurso] = useState(() => {
    const savedCurso = localStorage.getItem('curso');
    return savedCurso ? JSON.parse(savedCurso) : { idCurso: null, nombre: null };
  });

  // Guarda el idCurso y nombre del curso en localStorage cuando cambie
  useEffect(() => {
    if (curso.idCurso && curso.nombre) {
      localStorage.setItem('curso', JSON.stringify(curso));
    }
  }, [curso]);

  return (
    <CursoContext.Provider value={{ curso, setCurso }}>
      {children}
    </CursoContext.Provider>
  );
};
