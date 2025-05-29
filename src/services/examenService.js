import api from './api';

const examenService = {
    obtenerExamenesDocente: async (idDocente) => {
        try {
            const response = await api.get(`/examen/mis-examenes-docente/${idDocente}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    eliminarExamen: async (idExamen) => {
        try {
            const response = await api.delete(`/examen/eliminar/${idExamen}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default examenService; 