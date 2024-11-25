import {useState, useEffect, useContext} from 'react';
import { getAsistenciasCurso } from '../../services/Asistencias.service';
import { CursoContext } from '../../context/CursoContext';

const useAsistencias = () => {
    const { idCurso } = useContext(CursoContext);
    const [asistencias, setAsistencias] = useState([]);

    const fetchAsistencias = async () => {
        try {
            const datosAsistencias = await getAsistenciasCurso(idCurso);
            setAsistencias(datosAsistencias || []);
        } catch (error) {
            console.error("Error al cargar las asistencias:", error);
        }
    };

    useEffect(() => {
        fetchAsistencias();
    }, [idCurso]);

    return { asistencias, fetchAsistencias };
};

export default useAsistencias;