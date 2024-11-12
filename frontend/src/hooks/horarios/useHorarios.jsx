import { useState, useEffect } from 'react';
import { AllHorarios, createHorario, updateHorario, deleteHorario } from '@services/horario.service.js';

export function useHorarios() {
    const [horarios, setHorarios] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchHorarios();
    }, []);

    const fetchHorarios = async () => {
        const data = await AllHorarios();
        console.log(data);
        
        if (data.error) {
            setError(data.error);
        } else {
            setHorarios(data.data);
        }
    };

    const addHorario = async (horario) => {
        const data = await createHorario(horario);
        if (data.error) {
            setError(data.error);
        } else {
            setHorarios([...horarios, data]);
        }
    };

    const editHorario = async (horario) => {
        const data = await updateHorario(horario);
        if (data.error) {
            setError(data.error);
        } else {
            setHorarios(horarios.map(h => h.id_horario === horario.id_horario ? data : h));
        }
    };

    const removeHorario = async (id_horario) => {
        const data = await deleteHorario(id_horario);
        if (data.error) {
            setError(data.error);
        } else {
            setHorarios(horarios.filter(h => h.id_horario !== id_horario));
        }
    };

    return { horarios, fetchHorarios, addHorario, editHorario, removeHorario, error };
}