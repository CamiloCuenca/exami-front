import api from './api';

export const temaService = {
    obtenerTemas: async () => {
        try {
            const response = await api.get('/examen/temas');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    obtenerTemaPorId: async (idTema) => {
        try {
            const response = await api.get(`/examen/temas/${idTema}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}; 