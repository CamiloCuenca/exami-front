import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/navbar';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { BookOpen, CheckCircle, Users, BarChart2 } from 'react-feather';
import Swal from 'sweetalert2';

const HomeProfe = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [estadisticas, setEstadisticas] = useState({
        totalExamenes: 0,
        examenesActivos: 0,
        totalEstudiantes: 0,
        promedioNotas: 0
    });
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || user.tipoUsuario !== "Docente") {
            navigate("/login");
            return;
        }
        cargarEstadisticas();
    }, [navigate]);

    const cargarEstadisticas = async () => {
        try {
            // Simulando carga de estadísticas
            await new Promise(resolve => setTimeout(resolve, 500));
            setEstadisticas({
                totalExamenes: 15,
                examenesActivos: 5,
                totalEstudiantes: 120,
                promedioNotas: 7.8
            });
        } catch (error) {
            console.error("Error al cargar estadísticas:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar los datos',
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
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 font-sans">
            <Navbar />
            
            <main className="container mx-auto px-4 py-8">
                {/* Encabezado */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-indigo-800 font-heading">
                        Panel de Control del Docente
                    </h1>
                    <Link 
                        to="/crear-examen"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                        Crear Nuevo Examen
                    </Link>
                </div>

                {/* Tarjetas de Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        {
                            title: "Total Exámenes",
                            value: estadisticas.totalExamenes,
                            icon: <BookOpen className="h-8 w-8 text-indigo-600" />,
                            color: "from-indigo-500 to-indigo-600"
                        },
                        {
                            title: "Exámenes Activos",
                            value: estadisticas.examenesActivos,
                            icon: <CheckCircle className="h-8 w-8 text-green-600" />,
                            color: "from-green-500 to-green-600"
                        },
                        {
                            title: "Total Estudiantes",
                            value: estadisticas.totalEstudiantes,
                            icon: <Users className="h-8 w-8 text-purple-600" />,
                            color: "from-purple-500 to-purple-600"
                        },
                        {
                            title: "Promedio Notas",
                            value: estadisticas.promedioNotas.toFixed(1),
                            icon: <BarChart2 className="h-8 w-8 text-blue-600" />,
                            color: "from-blue-500 to-blue-600"
                        }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`bg-gradient-to-r ${stat.color} text-white rounded-xl p-6 shadow-lg`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium opacity-80">{stat.title}</p>
                                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                                </div>
                                {stat.icon}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Acciones Rápidas */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans mt-8">
                    {[
                        {
                            title: "Gestionar Preguntas",
                            description: "Crea, edita o elimina preguntas para tus exámenes",
                            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>,
                            link: "/gestionar-preguntas"
                        },
                        {
                            title: "Mis Exámenes",
                            description: "Ver y gestionar todos tus exámenes creados",
                            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>,
                            link: "/examenes-docente"
                        },
                        {
                            title: "Estadísticas",
                            description: "Analiza el rendimiento de tus estudiantes",
                            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>,
                            link: "/estadisticas"
                        }
                    ].map((action, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <div className="text-4xl mb-4 flex items-center justify-center">
                                {action.icon}
                            </div>
                            <h3 className="text-xl font-bold text-indigo-800 mb-2 font-heading">
                                {action.title}
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {action.description}
                            </p>
                            <Link
                                to={action.link}
                                className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center"
                            >
                                Ir a {action.title}
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

export default HomeProfe; 