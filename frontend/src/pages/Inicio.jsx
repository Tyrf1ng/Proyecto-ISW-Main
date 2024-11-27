import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';

function Inicio() {
  const [rolUsuario, setRolUsuario] = useState('');
  const [usuario, setUsuario] = useState({ nombre: '', apellido: '', rut: '' });

  useEffect(() => {
    const usuarioGuardado = JSON.parse(sessionStorage.getItem('usuario'));
    if (usuarioGuardado) {
      setRolUsuario(usuarioGuardado.rol);
      setUsuario({
        nombre: usuarioGuardado.nombre,
        apellido: usuarioGuardado.apellido,
        rut: usuarioGuardado.rut, // Extraer el RUT del usuario
      });
      console.log('Datos del usuario:', usuarioGuardado);
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
      <Typography variant="h6">
        {usuario.rut ? `RUT: ${usuario.rut}` : 'Cargando RUT...'}
      </Typography>
    </div>
  );
}

export default Inicio;
