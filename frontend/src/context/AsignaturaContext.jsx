import { createContext, useState, useEffect } from 'react';

export const AsignaturaContext = createContext();


export const AsignaturaProvider = ({ children }) => {

  const [asignatura, setAsignatura] = useState(() => {
    const savedAsignatura = localStorage.getItem('asignatura');
    return savedAsignatura ? JSON.parse(savedAsignatura) : { idAsignatura: null, nombre: null };
  });


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