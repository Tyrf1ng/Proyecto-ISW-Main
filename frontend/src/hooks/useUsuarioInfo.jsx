import { useState, useEffect, useContext } from "react";
import { getUsuarioByRut } from "../services/usuarios.service";
import { UsuarioContext } from "../context/UsuarioContext";

const useUsuarioInfo = () => {
  const [loading, setLoading] = useState(true);
  const [usuarioInfo, setUsuarioInfo] = useState(null); // Estado para la información del usuario
  const { usuario } = useContext(UsuarioContext); // Obtener usuario desde el contexto

  useEffect(() => {
    const fetchUsuario = async () => {
      if (!usuario?.rut) {
        console.error("El usuario no tiene un RUT válido");
        setLoading(false);
        return;
      }

      try {
        const data = await getUsuarioByRut(usuario.rut);
        setUsuarioInfo(data); // Guardar los datos del usuario en el estado
      } catch (error) {
        console.error("Error al obtener la información del usuario:", error);
      } finally {
        setLoading(false); // Termina el loading después del fetch
      }
    };

    fetchUsuario();
  }, [usuario?.rut]); // Escuchar cambios en el RUT

  return { usuarioInfo, loading };
};

export default useUsuarioInfo;
