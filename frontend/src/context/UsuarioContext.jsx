import { createContext, useState } from 'react';

const UsuarioContext = createContext();  // Crear el contexto

export const UsuarioProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  // Cargar usuario desde sessionStorage al iniciar
  const cargarUsuario = () => {
    const usuarioGuardado = JSON.parse(sessionStorage.getItem('usuario'));
    setUsuario(usuarioGuardado);
  };

  return (
    <UsuarioContext.Provider value={{ usuario, cargarUsuario }}>
      {children}
    </UsuarioContext.Provider>
  );
};

export { UsuarioContext };  // Asegúrate de exportar el contexto también
