import axios from './root.service.js';

export async function getUsuarios() {
  try {
    const { data } = await axios.get('/usuarios');
    return data.data;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
}

export async function createUsuario(data) {
  try {
    const response = await axios.post('/usuarios/crear', data);
    return response.data;
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw error;
  }
}

export async function updateUsuario(rut, data) {
  try {
    const response = await axios.patch(`/usuarios/actualizar/${rut}`, data);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    throw error;
  }
}

export async function deleteUsuario(rut) {
  try {
    const response = await axios.delete(`/usuarios/borrar/${rut}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    throw error;
  }
}

export async function getUsuarioByRut(rut) {
  try {
    const { data } = await axios.get(`/usuarios/rut/${rut}`);
    return data.data;
  } catch (error) {
    console.error('Error al obtener usuario por RUT:', error);
    throw error;
  }
}


export async function getRutsDocentes() {
  try {
    const { data } = await axios.get('/usuarios/docentes/ruts');
    return data.data; 
  } catch (error) {
    console.error('Error al obtener RUTs de docentes:', error);
    throw error;
  }
}