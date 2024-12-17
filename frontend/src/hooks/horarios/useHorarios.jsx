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
        if (data.error) {
            setError(data.error);
        } else {
            setHorarios(data.data || []);
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
            return { success: false, error: data.error };
        } else {
            setHorarios(horarios.filter(h => h.id_horario !== id_horario));
            return { success: true, data: data.data };
        }
    };

    const isHorarioValid = (hora_inicio, hora_fin, id_horario = null) => {
        if (!Array.isArray(horarios)) return true;
        for (let horario of horarios) {
            if (horario.id_horario !== id_horario) {
                if (
                    (hora_inicio >= horario.hora_inicio && hora_inicio < horario.hora_fin) ||
                    (hora_fin > horario.hora_inicio && hora_fin <= horario.hora_fin) ||
                    (hora_inicio <= horario.hora_inicio && hora_fin >= horario.hora_fin) ||
                    (hora_inicio === horario.hora_inicio || hora_fin === horario.hora_fin)
                ) {
                    return false;
                }
            }
        }
        return true;
    };

    return { horarios, fetchHorarios, addHorario, editHorario, removeHorario, isHorarioValid, error };
}