import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/navbar';
import ExamenCardEstudiante from '../components/ExamenCardEstudiante';
import api from '../services/api';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, CheckCircle, AlertCircle } from 'react-feather';

const ExamenesEstudiante = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [pendientes, setPendientes] = useState([]);
    const [enProgreso, setEnProgreso] = useState([]);
    const [expirados, setExpirados] = useState([]);
    const [examenes, setExamenes] = useState([]);
    const [activeTab, setActiveTab] = useState('disponibles');
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

            // Solo una llamada a la API
            const response = await api.get(`/examen/estudiante-ui/${user.idUsuario}`);

            if (!response.data.success) {
                throw new Error(response.data.message || "Error al cargar los exámenes");
            }

            const examenes = response.data.data || [];

            // Filtrar por estadoUI
            setPendientes(examenes.filter(e => e.estadoUI === "Disponible"));
            setEnProgreso(examenes.filter(e => e.estadoUI === "En Progreso"));
            setExpirados(examenes.filter(e => e.estadoUI === "Expirado"));
            setExamenes(examenes.filter(e => e.estadoUI === "Completado"));

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

    const tabs = [
        {
            id: 'disponibles',
            label: 'Disponibles',
            icon: <BookOpen size={20} />,
            count: pendientes.length,
            color: 'text-green-600',
            bgColor: 'bg-green-100'
        },
        {
            id: 'en-progreso',
            label: 'En Progreso',
            icon: <Clock size={20} />,
            count: enProgreso.length,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
        },
        {
            id: 'completados',
            label: 'Completados',
            icon: <CheckCircle size={20} />,
            count: examenes.length,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100'
        },
        {
            id: 'expirados',
            label: 'Expirados',
            icon: <AlertCircle size={20} />,
            count: expirados.length,
            color: 'text-red-600',
            bgColor: 'bg-red-100'
        }
    ];

    const renderExamenes = () => {
        switch (activeTab) {
            case 'disponibles':
                return pendientes.length > 0 ? (
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
                );
            case 'en-progreso':
                return enProgreso.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {enProgreso.map((examen) => (
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
                        <div className="text-center py-8 text-gray-500">
                            No tienes exámenes en progreso.
                        </div>
                );
            case 'completados':
                return examenes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {examenes.map((examen) => (
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
                        <div className="text-center py-8 text-gray-500">
                            No tienes exámenes completados.
                        </div>
                );
            case 'expirados':
                return expirados.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {expirados.map((examen) => (
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
                        <div className="text-center py-8 text-gray-500">
                            No tienes exámenes expirados.
                        </div>
                );
            default:
                return null;
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
                        Mis Exámenes
                    </h1>
                </div>

                {/* Pestañas */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <div className="flex space-x-4 mb-6 overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                                    activeTab === tab.id
                                        ? `${tab.bgColor} ${tab.color}`
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                {tab.icon}
                                <span>{tab.label}</span>
                                <span className={`ml-2 px-2 py-0.5 rounded-full text-sm ${
                                    activeTab === tab.id ? 'bg-white' : 'bg-gray-100'
                                }`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Contenido de las pestañas */}
                    <div className="mt-6">
                        {renderExamenes()}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ExamenesEstudiante; 