import api from './api';

const preguntaDisponibleService = {
    obtenerPreguntasDisponibles: async (idDocente, idTema = null, idTipoPregunta = null, idNivelDificultad = null) => {
        try {
            let url = `/pregunta/disponibles/${idDocente}`;
            
            if (idTema) url += `?idTema=${idTema}`;
            if (idTipoPregunta) url += `${idTema ? '&' : '?'}idTipoPregunta=${idTipoPregunta}`;
            if (idNivelDificultad) url += `${(idTema || idTipoPregunta) ? '&' : '?'}idNivelDificultad=${idNivelDificultad}`;
            
            const response = await api.get(url);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    eliminarPregunta: async (idPregunta) => {
        try {
            const response = await api.delete(`/pregunta/eliminar/${idPregunta}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default preguntaDisponibleService; 