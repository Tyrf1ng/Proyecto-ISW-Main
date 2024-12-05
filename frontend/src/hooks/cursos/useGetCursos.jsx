import { useState, useEffect } from 'react';
import { getCursos } from '@services/cursos.service.js';
import { getUsuario } from '@services/user.service.js'; // Nuevo servicio para validar el usuario

const useCursos = (rut) => {
    const [cursos, setCursos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCursos = async () => {
        setLoading(true);
        setError(null);
        try {
            // Validar el rol del usuario antes de obtener los cursos
            const usuario = await getUsuario(rut); // Servicio para obtener el usuario por rut
            if (!usuario || usuario.id_roles !== 2) {
                throw new Error('El usuario no tiene el rol de profesor o no existe.');
            }

            // Obtener los cursos después de la validación
            const response = await getCursos();
            console.log('API Response:', response); // Verifica la respuesta de la API
            const formattedData = response.map(curso => ({
                id_curso: curso.id_curso,
                nombre: curso.nombre,
                nivel: curso.nivel,
                rut_directivo: curso.rut_directivo,
            }));
            console.log('Formatted Data:', formattedData); // Verifica los datos formateados
            setCursos(formattedData);
        } catch (err) {
            console.error("Error: ", err);
            setError(err.message || 'Ocurrió un error al obtener los cursos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (rut) {
            fetchCursos();
        }
    }, [rut]);

    return { cursos, fetchCursos, setCursos, loading, error };
};

export default useCursos;
