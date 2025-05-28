import api from './api';

export const nivelDificultadService = {
    obtenerNivelesDificultad: async () => {
        try {
            const response = await api.get('/examen/niveles-dificultad');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    obtenerNivelDificultadPorId: async (idNivelDificultad) => {
        try {
            const response = await api.get(`/examen/niveles-dificultad/${idNivelDificultad}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}; 