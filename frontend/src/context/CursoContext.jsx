import { createContext, useState, useEffect } from 'react';

export const CursoContext = createContext();

export const CursoProvider = ({ children }) => {
  const [curso, setCurso] = useState(() => {
    const savedCurso = localStorage.getItem('curso');
    return savedCurso ? JSON.parse(savedCurso) : { idCurso: null, nombre: null };
  });

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
