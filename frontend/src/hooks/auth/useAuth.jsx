import { useState, useEffect } from 'react';
import * as jwt_decode from 'jwt-decode';
const useAuth = () => {
    const [user, setUser] = useState(null); 
    const [error, setError] = useState(''); 
    const [loading, setLoading] = useState(true);

    
    useEffect(() => {
        const token = localStorage.getItem('accessToken'); 
        if (token) {
            try {
                const decoded = jwt_decode(token); 
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

        setLoading(false); 
    }, []);

   
    const login = (token) => {
        localStorage.setItem('accessToken', token);
        const decoded = jwt_decode(token);
        setUser({
            nombre: decoded.nombre,
            apellido: decoded.apellido,
            email: decoded.email,
            rol: decoded.rol,
            rut: decoded.rut,
        });
        setError(''); 
    };

    // Función para manejar el logout
    const logout = () => {
        localStorage.removeItem('accessToken');
        setUser(null); 
        setError(''); 
    };

   
    const updateUserProfile = (updatedData) => {
        if (!user) {
            setError('No hay usuario autenticado.');
            return;
        }

        setUser(prevUser => ({
            ...prevUser,
            ...updatedData, 
        }));
        setError(''); 
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
