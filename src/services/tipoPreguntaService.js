import api from './api';

export const tipoPreguntaService = {
    obtenerTiposPregunta: async () => {
        try {
            const response = await api.get('/examen/tipos-pregunta');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    obtenerTipoPreguntaPorId: async (idTipoPregunta) => {
        try {
            const response = await api.get(`/examen/tipos-pregunta/${idTipoPregunta}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}; 