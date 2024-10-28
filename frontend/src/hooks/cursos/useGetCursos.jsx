import { useState, useEffect } from 'react';
import { getCursos } from '@services/cursos.service.js';

const useCursos = () => {
    const [cursos, setCursos] = useState([]);

    const fetchCursos = async () => {
        try {
            const response = await getCursos();
            console.log('API Response:', response); // Verifica la respuesta de la API
            const formattedData = response.map(curso => ({
                id_curso: curso.id_curso,
                nombre: curso.nombre,
                nivel: curso.nivel,
                rut_directivo: curso.rut_directivo,
            }));
            console.log('Formatted Data:', formattedData); // Verifica los datos formateados
            // dataLogged(formattedData); // Comenta esta línea para evitar la eliminación
            setCursos(formattedData);
        } catch (error) {
            console.error("Error: ", error);
        }
    };

    useEffect(() => {
        fetchCursos();
    }, []);

    return { cursos, fetchCursos, setCursos };
};

export default useCursos;