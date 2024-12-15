import { useContext, useEffect, useState } from "react";
import { UsuarioContext } from "../context/UsuarioContext";

const useCargarUsuario = () => {
  const { usuario, cargarUsuario } = useContext(UsuarioContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsuario = async () => {
      if (!usuario) {
        try {
          await cargarUsuario(); 
        } catch (error) {
          console.error("Error al cargar usuario:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUsuario();
  }, [usuario, cargarUsuario]);

  return { usuario, loading };
};

export default useCargarUsuario;