import api from './api';

const examenPreguntaService = {
    asignarPreguntasExamen: async (idExamen, idDocente, preguntas, umbralAprobacion, cantidadPreguntasTotal, cantidadPreguntasPresentar) => {
        try {
            if (!idExamen) {
                throw new Error('El ID del examen es requerido');
            }

            // Transformar los datos al formato esperado por el backend
            const requestData = {
                idExamen: Number(idExamen),
                idDocente: Number(idDocente),
                idsPreguntas: preguntas.map(p => Number(p.idPregunta)),
                porcentajes: preguntas.map(p => Number(p.porcentaje)),
                ordenes: preguntas.map((_, index) => index + 1),
                umbralAprobacion: Number(umbralAprobacion),
                cantidadPreguntasTotal: Number(cantidadPreguntasTotal),
                cantidadPreguntasPresentar: Number(cantidadPreguntasPresentar)
            };

            // Validar que todos los campos requeridos estén presentes
            if (!requestData.idDocente || !requestData.idsPreguntas.length || !requestData.umbralAprobacion) {
                throw new Error('Faltan campos requeridos en la solicitud');
            }

            const response = await api.post(`/examen/asignar-preguntas-examen/${requestData.idExamen}`, requestData);
            return response.data;
        } catch (error) {
            console.error('Error al asignar preguntas al examen:', error);
            throw error;
        }
    },

    obtenerPreguntasExamen: async (idExamen) => {
        try {
            if (!idExamen) {
                throw new Error('El ID del examen es requerido');
            }
            const response = await api.get(`/pregunta/disponibles/${idExamen}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener preguntas del examen:', error);
            throw error;
        }
    }
};

export default examenPreguntaService; 