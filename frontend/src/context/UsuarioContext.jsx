import { createContext, useState } from 'react';

const UsuarioContext = createContext();

export const UsuarioProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

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

export { UsuarioContext };
