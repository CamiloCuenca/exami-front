import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/navbar';
import ExamenCardEstudiante from '../components/ExamenCardEstudiante';
import api from '../services/api';
import Swal from 'sweetalert2';
import Layout from '../components/Layout';

const Examenes = () => {
    const [examenes, setExamenes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        cargarExamenes();
    }, []);

    const cargarExamenes = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user || !user.idUsuario) {
                throw new Error("No se pudo obtener el ID del estudiante");
            }

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
        <Layout>
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-indigo-800 mb-8 text-center">
                    Mis Exámenes
                </h1>

                {examenes.length === 0 ? (
                    <div className="text-center py-12">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        <p className="mt-4 text-lg font-semibold text-gray-600">No tienes exámenes disponibles</p>
                        <p className="mt-2 text-gray-500">Revisa más tarde o contacta a tu docente si crees que debería haber exámenes.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {examenes.map((examen) => (
                            <ExamenCardEstudiante
                                key={examen.idExamen}
                                examen={examen}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
        </Layout>
    );
};

export default Examenes;