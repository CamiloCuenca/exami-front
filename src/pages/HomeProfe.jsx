import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/navbar';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { BookOpen, CheckCircle, Users, BarChart2 } from 'react-feather';

const HomeProfe = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [examenes, setExamenes] = useState([]);
    const [estadisticas, setEstadisticas] = useState({
        totalExamenes: 0,
        examenesActivos: 0,
        totalEstudiantes: 0,
        promedioNotas: 0
    });
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        console.log("Usuario en HomeProfe:", user); // Para depuración
        if (!user) {
            navigate("/login");
            return;
        }
        if (user.tipoUsuario !== "Docente") {
            console.log("Tipo de usuario incorrecto:", user.tipoUsuario); // Para depuración
            navigate("/login");
            return;
        }
        cargarDatos();
    }, [navigate]);

    const cargarDatos = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user || !user.idUsuario) {
                throw new Error("No hay usuario autenticado");
            }

            // Cargar exámenes
            const responseExamenes = await api.get(`/api/quiz/docente/${user.idUsuario}/examenes`);
            setExamenes(responseExamenes.data);

            // Cargar estadísticas (simuladas por ahora)
            setEstadisticas({
                totalExamenes: responseExamenes.data.length,
                examenesActivos: responseExamenes.data.filter(e => e.estado === "Disponible").length,
                totalEstudiantes: 45, // Simulado
                promedioNotas: 8.5 // Simulado
            });

        } catch (error) {
            console.error("Error al cargar datos:", error);
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
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
            <Navbar />
            
            <main className="container mx-auto px-4 py-8 font-sans">
                {/* Encabezado */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-indigo-800 font-heading">
                        Panel de Control
                    </h1>
                    <Link 
                        to="/crear-examen"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                        Crear Nuevo Examen
                    </Link>
                </div>

                {/* Tarjetas de Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 font-sans">
                    {[
                        {
                            title: "Total Exámenes",
                            value: estadisticas.totalExamenes,
                            icon: <BookOpen size={32} className="text-blue-600" />,
                            color: "bg-blue-500"
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
                            icon: <BarChart2 size={32} className="text-indigo-600" />,
                            color: "bg-indigo-500"
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

                {/* Exámenes Recientes */}
                <section className="bg-white rounded-xl shadow-lg p-6 mb-8 font-sans">
                    <h2 className="text-xl font-bold text-indigo-800 mb-6 font-heading">
                        Exámenes Recientes
                    </h2>
                    {examenes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {examenes.slice(0, 6).map((examen) => (
                                <motion.div
                                    key={examen.idExamen}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300"
                                >
                                    <h3 className="font-semibold text-lg text-indigo-800 mb-2">
                                        {examen.nombre}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                        {examen.descripcion}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <span className={`px-3 py-1 rounded-full text-sm ${
                                            examen.estado === "Disponible" ? "bg-green-100 text-green-800" :
                                            examen.estado === "Finalizado" ? "bg-red-100 text-red-800" :
                                            "bg-yellow-100 text-yellow-800"
                                        }`}>
                                            {examen.estado}
                                        </span>
                                        <Link 
                                            to={`/examen/${examen.idExamen}`}
                                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                        >
                                            Ver detalles →
                                        </Link>
                                    </div>
                                </motion.div>
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11v6m0-6a2 2 0 100-4m0 4a2 2 0 110 4m4-2a2 2 0 100-4m0 4a2 2 0 110 4m-8-2a2 2 0 100-4m0 4a2 2 0 110 4m.5 1.5h.5m4-10h.5m4 0h.5M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2h-4l-2-2H9L7 6H3a2 2 0 00-2 2v10a2 2 0 002 2zm9.5-8.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-6 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm9 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                            </svg>
                            <p className="mt-4 text-lg font-semibold text-gray-600">¡Aún no has creado ningún examen!</p>
                            <p className="mt-2 text-gray-500">Comienza creando tu primer examen para verlo aquí.</p>
                            <Link 
                                to="/crear-examen"
                                className="mt-6 inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                            >
                                Crear Nuevo Examen
                            </Link>
                        </motion.div>
                    )}
                </section>

                {/* Acciones Rápidas */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
                    {[
                        {
                            title: "Banco de Preguntas",
                            description: "Gestiona tu banco de preguntas por temas",
                            icon: "📝",
                            link: "/banco-preguntas"
                        },
                        {
                            title: "Estadísticas",
                            description: "Visualiza el rendimiento de tus estudiantes",
                            icon: "📊",
                            link: "/estadisticas"
                        },
                        {
                            title: "Grupos",
                            description: "Administra tus grupos y estudiantes",
                            icon: "👥",
                            link: "/grupos"
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

export default HomeProfe; 