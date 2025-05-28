import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/navbar';
import ExamenCardEstudiante from '../components/ExamenCardEstudiante';
import api from '../services/api';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { BookOpen, CheckCircle, BarChart2, Award } from 'react-feather';
import Layout from '../components/Layout';

const HomeEstudiante = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [pendientes, setPendientes] = useState([]);
    const [completados, setCompletados] = useState([]);
    const [promedioNotas, setPromedioNotas] = useState(9.5);
    const [ultimaNota, setUltimaNota] = useState(5);
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
            const response = await api.get(`/examen/estudiante-ui/${user.idUsuario}`);
            if (!response.data.success) {
                throw new Error(response.data.message || "Error al cargar los exámenes");
            }
            const examenes = response.data.data || [];
            setPendientes(examenes.filter(e => e.estadoUI === "Disponible"));
            setCompletados(examenes.filter(e => e.estadoUI === "Completado"));
        } catch (error) {
            console.error("Error al cargar exámenes:", error);
            const mensajeError = error.response?.data?.message || 
                error.message || 
                'No se pudo conectar con el servidor';
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
        <Layout>
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
            <Navbar />
            <main className="container mx-auto px-4 py-8 font-sans">
                {/* Encabezado */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-indigo-800 font-heading">
                        Mi Panel de Estudiante
                    </h1>
                </div>

                {/* Tarjetas de Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 font-sans">
                    {[
                        {
                            title: "Exámenes Pendientes",
                            value: pendientes.length,
                            icon: <BookOpen size={32} className="text-yellow-600" />,
                            color: "bg-yellow-500"
                        },
                        {
                            title: "Exámenes Completados",
                            value: completados.length,
                            icon: <CheckCircle size={32} className="text-green-600" />,
                            color: "bg-green-500"
                        },
                        {
                            title: "Promedio General",
                            value: promedioNotas,
                            icon: <BarChart2 size={32} className="text-blue-600" />,
                            color: "bg-blue-500"
                        },
                        {
                            title: "Última Nota",
                            value: ultimaNota,
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
                    {pendientes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pendientes.map((examen) => (
                                <ExamenCardEstudiante
                                    key={examen.idExamen}
                                    examen={{
                                        ...examen,
                                        estado: examen.estadoUI,
                                        nombre: examen.nombreExamen || examen.nombre,
                                        fechaInicio: examen.fechaInicioExamenFormateada,
                                        fechaFin: examen.fechaFinExamenFormateada,
                                        nombreCurso: examen.nombreCurso,
                                        nombreTema: examen.nombreTema,
                                        descripcion: examen.descripcion,
                                        cantidadPreguntasTotal: examen.cantidadPreguntasTotal,
                                        cantidadPreguntasPresentar: examen.cantidadPreguntasPresentar,
                                        intentosPermitidos: examen.intentosPermitidos,
                                        pesoCurso: examen.pesoCurso,
                                        mostrarResultados: examen.mostrarResultados,
                                        permitirRetroalimentacion: examen.permitirRetroalimentacion,
                                        tiempoLimite: examen.tiempoLimite
                                    }}
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

            </main>
        </div>
        </Layout>
    );
};

export default HomeEstudiante;