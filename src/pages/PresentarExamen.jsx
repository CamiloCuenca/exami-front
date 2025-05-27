import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Swal from 'sweetalert2';

const PresentarExamen = () => {
    const { idPresentacion } = useParams();
    const navigate = useNavigate();
    const [preguntas, setPreguntas] = useState([]);
    const [preguntaActual, setPreguntaActual] = useState(0);
    const [respuestas, setRespuestas] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarPreguntas = async () => {
            try {
                const response = await api.get(`/examen/preguntas/${idPresentacion}`);
                if (response.data.success) {
                    setPreguntas(response.data.data);
                } else {
                    Swal.fire('Error', response.data.message || 'No se pudieron cargar las preguntas', 'error');
                }
            } catch (error) {
                Swal.fire('Error', 'No se pudieron cargar las preguntas', 'error');
            } finally {
                setLoading(false);
            }
        };
        cargarPreguntas();
    }, [idPresentacion]);

    const handleRespuesta = async (idPregunta, idOpcion, respuestaTexto = null) => {
        try {
            const response = await api.post(`examen/responder/${idPresentacion}`, {
                idPregunta,
                idOpcionSeleccionada: idOpcion,
                respuestaTexto
            });
            if (response.data.success) {
                setRespuestas({
                    ...respuestas,
                    [idPregunta]: response.data.data
                });
                if (preguntaActual < preguntas.length - 1) {
                    setPreguntaActual(preguntaActual + 1);
                } else {
                    // Finalizar examen
                    await api.post(`examen/finalizar/${idPresentacion}`);
                    Swal.fire('¡Examen finalizado!', 'Tus respuestas han sido enviadas.', 'success');
                    navigate('/examenes-estudiante');
                }
            } else {
                Swal.fire('Error', response.data.message || 'No se pudo enviar la respuesta', 'error');
            }
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'No se pudo enviar la respuesta', 'error');
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Cargando preguntas...</div>;
    }

    if (preguntas.length === 0) {
        return <div className="p-8 text-center">No hay preguntas para este examen.</div>;
    }

    const pregunta = preguntas[preguntaActual];

    return (
        <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Pregunta {preguntaActual + 1} de {preguntas.length}</h2>
            <p className="mb-4">{pregunta.textoPregunta}</p>
            <div className="mb-4">
                {pregunta.opciones.map(opcion => (
                    <button
                        key={opcion.idOpcion}
                        className="block w-full text-left p-2 mb-2 border rounded hover:bg-indigo-100"
                        onClick={() => handleRespuesta(pregunta.idPregunta, opcion.idOpcion)}
                        disabled={!!respuestas[pregunta.idPregunta]}
                    >
                        {opcion.texto}
                    </button>
                ))}
            </div>
            {/* Si tienes preguntas abiertas, puedes agregar un input aquí */}
        </div>
    );
};

export default PresentarExamen; 