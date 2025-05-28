import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import preguntaDisponibleService from '../services/preguntaDisponibleService';
import examenPreguntaService from '../services/examenPreguntaService';
import Swal from 'sweetalert2';

const AsignarPreguntasExamen = ({ 
    idExamen, 
    idDocente, 
    onPreguntasAsignadas, 
    umbralAprobacion,
    cantidadPreguntasTotal,
    cantidadPreguntasPresentar 
}) => {
    const [preguntas, setPreguntas] = useState([]);
    const [preguntasSeleccionadas, setPreguntasSeleccionadas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sumaPorcentajes, setSumaPorcentajes] = useState(0);
    const [porcentajePorPregunta, setPorcentajePorPregunta] = useState(0);

    useEffect(() => {
        console.log("AsignarPreguntasExamen - Props recibidas:", {
            idExamen,
            idDocente,
            umbralAprobacion,
            cantidadPreguntasTotal,
            cantidadPreguntasPresentar
        });
        cargarPreguntas();
    }, [idExamen, idDocente]);

    useEffect(() => {
        if (preguntasSeleccionadas.length > 0) {
            const porcentaje = umbralAprobacion / preguntasSeleccionadas.length;
            setPorcentajePorPregunta(porcentaje);
            
            setPreguntasSeleccionadas(prev => 
                prev.map(p => ({ ...p, porcentaje: porcentaje }))
            );
        } else {
            setPorcentajePorPregunta(0);
            setSumaPorcentajes(0);
        }
    }, [preguntasSeleccionadas.length, umbralAprobacion]);

    const cargarPreguntas = async () => {
        try {
            const response = await preguntaDisponibleService.obtenerPreguntasDisponibles(idDocente);
            if (Array.isArray(response)) {
                setPreguntas(response);
            }
        } catch (error) {
            console.error('Error al cargar preguntas:', error);
            Swal.fire('Error', 'No se pudieron cargar las preguntas', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSeleccionarPregunta = (pregunta) => {
        const yaSeleccionada = preguntasSeleccionadas.some(p => p.idPregunta === pregunta.idPregunta);
        
        if (yaSeleccionada) {
            setPreguntasSeleccionadas(prev => 
                prev.filter(p => p.idPregunta !== pregunta.idPregunta)
            );
        } else {
            // Verificar si ya se alcanzó el límite de preguntas
            if (preguntasSeleccionadas.length >= cantidadPreguntasTotal) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Límite de preguntas alcanzado',
                    text: `Solo puede seleccionar ${cantidadPreguntasTotal} preguntas para el examen.`,
                    confirmButtonColor: '#7c3aed'
                });
                return;
            }

            const nuevoPorcentaje = umbralAprobacion / (preguntasSeleccionadas.length + 1);
            setPreguntasSeleccionadas(prev => [
                ...prev.map(p => ({ ...p, porcentaje: nuevoPorcentaje })),
                { ...pregunta, porcentaje: nuevoPorcentaje }
            ]);
        }
    };

    const handleCambiarPorcentaje = (idPregunta, nuevoPorcentaje) => {
        const porcentaje = Number(nuevoPorcentaje);
        if (porcentaje < 0 || porcentaje > 100) {
            Swal.fire('Error', 'El porcentaje debe estar entre 0 y 100', 'error');
            return;
        }

        setPreguntasSeleccionadas(prev => 
            prev.map(p => 
                p.idPregunta === idPregunta 
                    ? { ...p, porcentaje }
                    : p
            )
        );
    };

    const calcularSumaPorcentajes = () => {
        const suma = preguntasSeleccionadas.reduce((acc, p) => acc + (p.porcentaje || 0), 0);
        setSumaPorcentajes(suma);
        return suma;
    };

    useEffect(() => {
        calcularSumaPorcentajes();
    }, [preguntasSeleccionadas]);

    const handleAsignarPreguntas = async () => {
        console.log("Intentando asignar preguntas con ID de examen:", idExamen);
        
        if (!idExamen) {
            Swal.fire('Error', 'El ID del examen es requerido', 'error');
            return;
        }

        if (preguntasSeleccionadas.length === 0) {
            Swal.fire('Error', 'Debe seleccionar al menos una pregunta', 'error');
            return;
        }

        if (preguntasSeleccionadas.length !== cantidadPreguntasTotal) {
            Swal.fire('Error', `Debe seleccionar exactamente ${cantidadPreguntasTotal} preguntas`, 'error');
            return;
        }

        const suma = calcularSumaPorcentajes();
        if (Math.abs(suma - umbralAprobacion) > 0.01) {
            Swal.fire('Error', `La suma de los porcentajes debe ser ${umbralAprobacion}%`, 'error');
            return;
        }

        try {
            console.log('Enviando datos al backend:', {
                idExamen,
                idDocente,
                cantidadPreguntas: preguntasSeleccionadas.length,
                umbralAprobacion,
                cantidadPreguntasTotal,
                cantidadPreguntasPresentar
            });

            const response = await examenPreguntaService.asignarPreguntasExamen(
                idExamen,
                idDocente,
                preguntasSeleccionadas,
                umbralAprobacion,
                cantidadPreguntasTotal,
                cantidadPreguntasPresentar
            );

            if (response.success) {
                Swal.fire('Éxito', response.message, 'success');
                if (onPreguntasAsignadas) {
                    onPreguntasAsignadas();
                }
            } else {
                Swal.fire('Error', response.message, 'error');
            }
        } catch (error) {
            console.error('Error al asignar preguntas:', error);
            const mensajeError = error.response?.data?.message || error.message || 'No se pudieron asignar las preguntas';
            Swal.fire('Error', mensajeError, 'error');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Seleccionar Preguntas</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Seleccionadas: {preguntasSeleccionadas.length} de {cantidadPreguntasTotal} preguntas
                        {cantidadPreguntasPresentar < cantidadPreguntasTotal && 
                            ` (Se presentarán ${cantidadPreguntasPresentar} preguntas aleatoriamente)`}
                    </p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-600">
                        <p>Umbral de aprobación: {umbralAprobacion}%</p>
                        <p className={`${Math.abs(sumaPorcentajes - umbralAprobacion) <= 0.01 ? 'text-green-600' : 'text-red-600'}`}>
                            Suma actual: {sumaPorcentajes.toFixed(2)}%
                        </p>
                        {preguntasSeleccionadas.length > 0 && (
                            <p>Porcentaje por pregunta: {porcentajePorPregunta.toFixed(2)}%</p>
                        )}
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAsignarPreguntas}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            preguntasSeleccionadas.length === cantidadPreguntasTotal && 
                            Math.abs(sumaPorcentajes - umbralAprobacion) <= 0.01
                                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={preguntasSeleccionadas.length !== cantidadPreguntasTotal || 
                                Math.abs(sumaPorcentajes - umbralAprobacion) > 0.01}
                    >
                        Asignar Preguntas
                    </motion.button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {preguntas.map((pregunta) => {
                    const estaSeleccionada = preguntasSeleccionadas.some(p => p.idPregunta === pregunta.idPregunta);
                    const preguntaSeleccionada = preguntasSeleccionadas.find(p => p.idPregunta === pregunta.idPregunta);

                    return (
                        <motion.div
                            key={pregunta.idPregunta}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`rounded-lg p-4 border-2 transition-all cursor-pointer ${
                                estaSeleccionada 
                                    ? 'border-indigo-500 bg-indigo-50' 
                                    : preguntasSeleccionadas.length >= cantidadPreguntasTotal
                                        ? 'border-gray-200 opacity-50 cursor-not-allowed'
                                        : 'border-gray-200 hover:border-indigo-300'
                            }`}
                            onClick={() => handleSeleccionarPregunta(pregunta)}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    pregunta.nombreNivelDificultad === 'Fácil' ? 'bg-green-100 text-green-800' :
                                    pregunta.nombreNivelDificultad === 'Media' ? 'bg-blue-100 text-blue-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {pregunta.nombreNivelDificultad}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {pregunta.tiempoMaximo} seg
                                </span>
                            </div>

                            <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2">
                                {pregunta.textoPregunta}
                            </h3>

                            {estaSeleccionada && (
                                <div className="mt-2">
                                    <label className="block text-sm text-gray-600 mb-1">
                                        Porcentaje:
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        value={preguntaSeleccionada.porcentaje}
                                        onChange={(e) => handleCambiarPorcentaje(pregunta.idPregunta, e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default AsignarPreguntasExamen; 