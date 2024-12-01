import { useState, useEffect } from 'react';
import * as jwt_decode from 'jwt-decode'; // Importación de jwt-decode

const useAuth = () => {
    const [user, setUser] = useState(null); // Estado para almacenar los datos del usuario
    const [error, setError] = useState(''); // Para manejar errores globales
    const [loading, setLoading] = useState(true); // Estado de carga

    // Hook que se ejecuta al cargar el componente o cuando el token cambia
    useEffect(() => {
        const token = localStorage.getItem('accessToken'); // Suponiendo que guardas el token en localStorage

        if (token) {
            try {
                const decoded = jwt_decode(token); // Decodificamos el token
                setUser({
                    nombre: decoded.nombre,
                    apellido: decoded.apellido,
                    email: decoded.email,
                    rol: decoded.rol,
                    rut: decoded.rut,
                });
            } catch (err) {
                console.error('Error al decodificar el token JWT', err);
                setError('Token inválido o expirado.');
            }
        } else {
            setError('No hay token de autenticación.');
        }

        setLoading(false); // Seteamos loading a false una vez que se haya realizado el chequeo
    }, []);

    // Función para manejar el login, guardando el token y el usuario en el estado
    const login = (token) => {
        localStorage.setItem('accessToken', token); // Guardamos el token en localStorage
        const decoded = jwt_decode(token);
        setUser({
            nombre: decoded.nombre,
            apellido: decoded.apellido,
            email: decoded.email,
            rol: decoded.rol,
            rut: decoded.rut,
        });
        setError(''); // Limpiar cualquier error anterior
    };

    // Función para manejar el logout
    const logout = () => {
        localStorage.removeItem('accessToken'); // Eliminamos el token del localStorage
        setUser(null); // Limpiamos el estado del usuario
        setError(''); // Limpiamos cualquier error
    };

    // Función para actualizar el perfil del usuario
    const updateUserProfile = (updatedData) => {
        if (!user) {
            setError('No hay usuario autenticado.');
            return;
        }

        setUser(prevUser => ({
            ...prevUser,
            ...updatedData, // Actualizamos los datos del usuario con los nuevos valores
        }));
        setError(''); // Limpiamos cualquier error al actualizar el perfil
    };

    return {
        user,
        error,
        loading,
        login,
        logout,
        updateUserProfile,
    };
};

export default useAuth;
