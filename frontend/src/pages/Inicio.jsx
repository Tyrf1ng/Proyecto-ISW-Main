import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';

function Inicio() {
  const [rolUsuario, setRolUsuario] = useState('');
  const [usuario, setUsuario] = useState({ nombre: '', apellido: '' });

  useEffect(() => {
    const usuarioGuardado = JSON.parse(sessionStorage.getItem('usuario'));
    if (usuarioGuardado) {
      setRolUsuario(usuarioGuardado.rol);
      setUsuario({
        nombre: usuarioGuardado.nombre,
        apellido: usuarioGuardado.apellido,
      });
      console.log("Tipo de usuario:", usuarioGuardado.tipo); // Aquí puedes comprobar el tipo
    }
  }, []);
  
  return (
    <div>
      <Typography variant="h4">Página de Inicio</Typography>
      <Typography variant="h6">
        {`Bienvenido, ${usuario.nombre} ${usuario.apellido}`}
      </Typography>
      <Typography variant="h6">
        {rolUsuario ? `Rol: ${rolUsuario}` : 'Cargando rol...'}
      </Typography>
    </div>
  );
}

export default Inicio;
