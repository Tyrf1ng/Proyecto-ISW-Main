import { useState, useEffect } from 'react';
import { getCursos } from '@services/cursos.service.js';

const useCursos = () => {
    const [cursos, setCursos] = useState([]);

    const fetchCursos = async () => {
        try {
            const response = await getCursos();
            console.log('API Response:', response); // Verifica la respuesta de la API
            const formattedData = response.map(curso => ({
                id_Curso: curso.id_Curso,
                nombreCurso: curso.nombreCurso,
                nivel: curso.nivel,
                rutDocente: curso.rutDocente,
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

    const dataLogged = (formattedData) => {
        try {
            const { rut } = JSON.parse(sessionStorage.getItem('usuario'));
            for (let i = 0; i < formattedData.length; i++) {
                if (formattedData[i].rutDocente === rut) {
                    formattedData.splice(i, 1);
                    break;
                }
            }
            console.log('Data after logging:', formattedData); // Verifica los datos después de la eliminación
        } catch (error) {
            console.error("Error: ", error);
        }
    };

    return { cursos, fetchCursos, setCursos };
};

export default useCursos;