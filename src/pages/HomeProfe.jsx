import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/navbar';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
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
        <Layout>
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 font-sans">
            <Navbar />
            
            <main className="container mx-auto px-4 py-8">
                {/* Encabezado */}
                <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-indigo-800 font-heading"> Panel de Control del Docente</h1>
                       
                 
                </div>

                {/* Tarjetas de Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        {
                            title: "Total Exámenes",
                            value: estadisticas.totalExamenes,
                            icon: <BookOpen size={32} className="text-indigo-600" />,
                            color: "bg-indigo-500"
                        },
                        {
                            title: "Exámenes Activos",
                            value: estadisticas.examenesActivos,
                            icon: <CheckCircle size={32} className="text-green-600" />,
                            color: "bg-green-500"
                        },
                        {
                            title: "Total Estudiantes",
                            value: estadisticas.totalEstudiantes,
                            icon: <Users size={32} className="text-purple-600" />,
                            color: "bg-purple-500"
                        },
                        {
                            title: "Promedio Notas",
                            value: estadisticas.promedioNotas.toFixed(1),
                            icon: <BarChart2 size={32} className="text-blue-600" />,
                            color: "bg-blue-500"
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
                            whileHover={{ translateY: -5 }}
                            className="bg-white rounded-xl p-6 shadow-lg cursor-pointer"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">{action.title}</p>
                                    <p className="text-gray-600 text-sm mt-1">{action.description}</p>
                                </div>
                                <div className="p-3 rounded-full bg-gray-100">
                                    {action.icon}
                                </div>
                            </div>
                            <Link
                                to={action.link}
                                className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center"
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
        </Layout>
    );
};

export default HomeProfe; 