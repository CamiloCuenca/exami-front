import api from './api';

const preguntaService = {
    agregarPregunta: async (preguntaData) => {
        try {
            const response = await api.post('/examen/crear-pregunta', preguntaData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default preguntaService;