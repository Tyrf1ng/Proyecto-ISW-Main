import axios from './root.service.js';
import cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { convertirMinusculas } from '@helpers/formatData.js';

export async function login(dataUser) {
    try {
        const response = await axios.post('/auth/login', {
            email: dataUser.email, 
            password: dataUser.password
        });
        const { status, data } = response;
        if (status === 200) {
            const { nombre, apellido, email, rut, rol, tipo } = jwtDecode(data.data.token);
            const userData = { nombre, apellido, email, rut, rol, tipo };
            sessionStorage.setItem('usuario', JSON.stringify(userData));
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.data.token}`;
            cookies.set('jwt-auth', data.data.token, { path: '/' });
            return response.data;
        }
    } catch (error) {
        return error.response?.data || { message: 'Error interno del servidor' };
    }
}

export async function register(data) {
    try {
        const dataRegister = convertirMinusculas(data);
        const { nombreCompleto, email, rut, password } = dataRegister;
        const response = await axios.post('/auth/register', {
            nombreCompleto,
            email,
            rut,
            password,
        });
        return response.data;
    } catch (error) {
        return error.response?.data || { message: 'Error interno del servidor' };
    }
}

export async function logout() {
    try {
        await axios.post('/auth/logout');
        sessionStorage.removeItem('usuario');
        cookies.remove('jwt');
        cookies.remove('jwt-auth');
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
}
