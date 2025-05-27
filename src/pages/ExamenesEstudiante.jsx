import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/navbar';
import ExamenCardEstudiante from '../components/ExamenCardEstudiante';
import api from '../services/api';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const ExamenesEstudiante = () => {
    const [examenes, setExamenes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
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
s
            const response = await api.get(`/examen/mis-examenes/${user.idUsuario}`);
            
            if (response.data.success) {
                setExamenes(response.data.data || []);
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
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-indigo-800 mb-8 text-center">
                    Mis Exámenes
                </h1>

                {/* Exámenes Disponibles */}
                <section className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-bold text-indigo-800 mb-6">
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
                        <div className="text-center py-8 text-gray-500">
                            No tienes exámenes disponibles en este momento.
                        </div>
                    )}
                </section>

                {/* Exámenes en Progreso */}
                <section className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-bold text-indigo-800 mb-6">
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
                <section className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-bold text-indigo-800 mb-6">
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
                <section className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-bold text-indigo-800 mb-6">
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
            </main>
        </div>
    );
};

export default ExamenesEstudiante; 