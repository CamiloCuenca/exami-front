import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/navbar';
import ExamenCardEstudiante from '../components/ExamenCardEstudiante';
import api from '../services/api';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { BookOpen, CheckCircle, BarChart2, Award } from 'react-feather';

const HomeEstudiante = () => {
    const [examenes, setExamenes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [estadisticas, setEstadisticas] = useState({
        examenesPendientes: 0,
        examenesCompletados: 0,
        promedioNotas: 0,
        ultimaNota: 0
    });
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || user.tipoUsuario !== "Estudiante") {
            navigate("/login");
            return;
        }
        cargarExamenes();
    }, [navigate]);

    const cargarExamenes = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user || !user.idUsuario) {
                throw new Error("No se pudo obtener el ID del estudiante");
            }

            const response = await api.get(`/examen/mis-examenes/${user.idUsuario}`);
            
            if (response.data.success) {
                setExamenes(response.data.data || []);
                setEstadisticas({
                    examenesPendientes: response.data.data.filter(e => e.estado === "Disponible").length,
                    examenesCompletados: response.data.data.filter(e => e.estado === "Finalizado").length,
                    promedioNotas: 8.5, // Simulado
                    ultimaNota: 9.0 // Simulado
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.data.message || 'Error al cargar los exámenes',
                    confirmButtonColor: '#7c3aed'
                });
            }
        } catch (error) {
            console.error("Error al cargar exámenes:", error);
            const mensajeError = error.response 
                ? `Error ${error.response.status}: ${error.response.data?.message || 'Error desconocido'}`
                : 'No se pudo conectar con el servidor';
            
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: mensajeError,
                confirmButtonColor: '#7c3aed'
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
            <Navbar />
            
            <main className="container mx-auto px-4 py-8 font-sans">
                {/* Encabezado */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-indigo-800 font-heading">
                        Mi Panel de Estudiante
                    </h1>
                    <Link 
                        to="/examenes"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                        Ver Todos los Exámenes
                    </Link>
                </div>

                {/* Tarjetas de Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 font-sans">
                    {[
                        {
                            title: "Exámenes Pendientes",
                            value: estadisticas.examenesPendientes,
                            icon: <BookOpen size={32} className="text-yellow-600" />,
                            color: "bg-yellow-500"
                        },
                        {
                            title: "Exámenes Completados",
                            value: estadisticas.examenesCompletados,
                            icon: <CheckCircle size={32} className="text-green-600" />,
                            color: "bg-green-500"
                        },
                        {
                            title: "Promedio General",
                            value: estadisticas.promedioNotas.toFixed(1),
                            icon: <BarChart2 size={32} className="text-blue-600" />,
                            color: "bg-blue-500"
                        },
                        {
                            title: "Última Nota",
                            value: estadisticas.ultimaNota.toFixed(1),
                            icon: <Award size={32} className="text-purple-600" />,
                            color: "bg-purple-500"
                        }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ translateY: -5 }}
                            className="bg-white rounded-xl p-6 shadow-lg cursor-pointer"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                                </div>
                                <div className="p-3 rounded-full bg-gray-100">
                                    {stat.icon}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Exámenes Disponibles */}
                <section className="bg-white rounded-xl shadow-lg p-6 mb-8 font-sans">
                    <h2 className="text-xl font-bold text-indigo-800 mb-6 font-heading">
                        Exámenes Disponibles
                    </h2>
                    {examenes.filter(e => e.estado === "Disponible").length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {examenes
                                .filter(e => e.estado === "Disponible")
                                .map((examen) => (
                                    <ExamenCardEstudiante
                                        key={examen.idExamen}
                                        examen={examen}
                                    />
                                ))}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-center py-12 text-gray-500"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                            <p className="mt-4 text-lg font-semibold text-gray-600">¡No tienes exámenes disponibles en este momento!</p>
                            <p className="mt-2 text-gray-500">Revisa más tarde o contacta a tu docente si crees que debería haber exámenes.</p>
                        </motion.div>
                    )}
                </section>

                {/* Exámenes en Progreso */}
                <section className="bg-white rounded-xl shadow-lg p-6 mb-8 font-sans">
                    <h2 className="text-xl font-bold text-indigo-800 mb-6 font-heading">
                        Exámenes en Progreso
                    </h2>
                    {examenes.filter(e => e.estado === "En Progreso").length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {examenes
                                .filter(e => e.estado === "En Progreso")
                                .map((examen) => (
                                    <ExamenCardEstudiante
                                        key={examen.idExamen}
                                        examen={examen}
                                    />
                                ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No tienes exámenes en progreso.
                        </div>
                    )}
                </section>

                {/* Exámenes Completados */}
                <section className="bg-white rounded-xl shadow-lg p-6 mb-8 font-sans">
                    <h2 className="text-xl font-bold text-indigo-800 mb-6 font-heading">
                        Exámenes Completados
                    </h2>
                    {examenes.filter(e => e.estado === "Completado").length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {examenes
                                .filter(e => e.estado === "Completado")
                                .map((examen) => (
                                    <ExamenCardEstudiante
                                        key={examen.idExamen}
                                        examen={examen}
                                    />
                                ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No tienes exámenes completados.
                        </div>
                    )}
                </section>

                {/* Exámenes Expirados */}
                <section className="bg-white rounded-xl shadow-lg p-6 mb-8 font-sans">
                    <h2 className="text-xl font-bold text-indigo-800 mb-6 font-heading">
                        Exámenes Expirados
                    </h2>
                    {examenes.filter(e => e.estado === "Expirado").length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {examenes
                                .filter(e => e.estado === "Expirado")
                                .map((examen) => (
                                    <ExamenCardEstudiante
                                        key={examen.idExamen}
                                        examen={examen}
                                    />
                                ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No tienes exámenes expirados.
                        </div>
                    )}
                </section>

                {/* Acciones Rápidas */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
                    {[
                        {
                            title: "Mis Resultados",
                            description: "Revisa tus calificaciones y retroalimentación",
                            icon: "📊",
                            link: "/resultados"
                        },
                        {
                            title: "Horario de Clases",
                            description: "Consulta tu horario y ubicaciones",
                            icon: "📅",
                            link: "/horario"
                        },
                        {
                            title: "Plan de Estudio",
                            description: "Accede al contenido de tus cursos",
                            icon: "📚",
                            link: "/plan-estudio"
                        }
                    ].map((action, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <div className="text-4xl mb-4">{action.icon}</div>
                            <h3 className="text-xl font-bold text-indigo-800 mb-2">
                                {action.title}
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {action.description}
                            </p>
                            <Link 
                                to={action.link}
                                className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center"
                            >
                                Acceder
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </motion.div>
                    ))}
                </section>
            </main>
        </div>
    );
};

export default HomeEstudiante; 