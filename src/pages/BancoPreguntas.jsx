import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import preguntaDisponibleService from '../services/preguntaDisponibleService';
import Layout from '../components/Layout';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';

const BancoPreguntas = () => {
    const [preguntas, setPreguntas] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        cargarPreguntas();
    }, []);

    const cargarPreguntas = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.idUsuario) {
                Swal.fire('Error', 'No se encontró el usuario docente', 'error');
                navigate('/login');
                return;
            }

            const response = await preguntaDisponibleService.obtenerPreguntasDisponibles(user.idUsuario);
            console.log('Respuesta del servidor:', response);
            
            if (Array.isArray(response)) {
                setPreguntas(response);
            } else {
                console.error('La respuesta no es un array:', response);
                setPreguntas([]);
            }
        } catch (error) {
            console.error('Error al cargar preguntas:', error);
            Swal.fire('Error', 'No se pudieron cargar las preguntas', 'error');
            setPreguntas([]);
        } finally {
            setLoading(false);
        }
    };

    const handleEliminarPregunta = async (idPregunta) => {
        try {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: "Esta acción no se puede deshacer",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#7c3aed',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                const response = await preguntaDisponibleService.eliminarPregunta(idPregunta);
                
                if (response.codigoResultado === 1) {
                    setPreguntas(prevPreguntas => prevPreguntas.filter(p => p.idPregunta !== idPregunta));
                    
                    Swal.fire({
                        icon: 'success',
                        title: '¡Eliminado!',
                        text: response.mensajeResultado,
                        confirmButtonColor: '#7c3aed'
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.mensajeResultado || 'No se pudo eliminar la pregunta',
                        confirmButtonColor: '#7c3aed'
                    });
                }
            }
        } catch (error) {
            console.error('Error al eliminar la pregunta:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo eliminar la pregunta',
                confirmButtonColor: '#7c3aed'
            });
        }
    };

    const getColorByTipo = (tipo) => {
        switch (tipo) {
            case 'Selección múltiple': return 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200';
            case 'Selección única': return 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200';
            case 'Falso/Verdadero': return 'bg-gradient-to-br from-green-50 to-green-100 border-green-200';
            default: return 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200';
        }
    };

    const getColorByDificultad = (dificultad) => {
        switch (dificultad) {
            case 'Fácil': return 'bg-green-100 text-green-800';
            case 'Media': return 'bg-blue-100 text-blue-800';
            case 'Difícil': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-indigo-800 font-heading">Banco de Preguntas</h1>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/formulario-pregunta')}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                >
                    Nueva Pregunta
                </motion.button>
            </div>

            {preguntas.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="text-gray-600 text-lg mb-4">No hay preguntas disponibles</p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/formulario-pregunta')}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                    >
                        Crear mi primera pregunta
                    </motion.button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {preguntas.map((pregunta, index) => (
                        <motion.div
                            key={pregunta.idPregunta}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className={`rounded-xl shadow-lg p-6 border ${getColorByTipo(pregunta.nombreTipoPregunta)} hover:shadow-xl transition-all duration-300`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getColorByDificultad(pregunta.nombreNivelDificultad)}`}>
                                    {pregunta.nombreNivelDificultad}
                                </span>
                                <div className="flex gap-2">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        pregunta.esPublica ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {pregunta.esPublica ? 'Pública' : 'Privada'}
                                    </span>
                                    <button
                                        onClick={() => handleEliminarPregunta(pregunta.idPregunta)}
                                        className="p-1 rounded-full hover:bg-red-100 transition-colors"
                                        title="Eliminar pregunta"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-lg font-semibold mb-4 text-gray-800 line-clamp-2">
                                {pregunta.textoPregunta}
                            </h3>

                            <div className="space-y-2 mb-4">
                                {pregunta.opciones && pregunta.opciones.map((opcion) => (
                                    <div
                                        key={opcion.idOpcion}
                                        className={`p-3 rounded-lg ${
                                            opcion.esCorrecta 
                                                ? 'bg-green-50 border border-green-200' 
                                                : 'bg-white border border-gray-200'
                                        }`}
                                    >
                                        <span className="text-sm text-gray-700 flex items-center">
                                            {opcion.textoOpcion}
                                            {opcion.esCorrecta && (
                                                <span className="ml-2 text-green-600">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between items-center text-sm text-gray-600 border-t border-gray-200 pt-3">
                                <span className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    {pregunta.nombreTema}
                                </span>
                                <div className="flex items-center space-x-4">
                                    <span className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {pregunta.tiempoMaximo} seg
                                    </span>
                                    <span className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                        {pregunta.porcentaje}%
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </Layout>
    );
};

export default BancoPreguntas; 