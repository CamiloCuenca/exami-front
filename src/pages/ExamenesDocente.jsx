import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/navbar';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import ExamenCard from '../components/ExamenCard';
import Layout from '../components/Layout';

const ExamenesDocente = () => {
    const [examenes, setExamenes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            navigate("/login");
            return;
        }
        if (user.tipoUsuario !== "Docente") {
            navigate("/login");
            return;
        }
        cargarExamenesDocente();
    }, [navigate]);

    const cargarExamenesDocente = async () => {
        setIsLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user || !user.idUsuario) {
                throw new Error("No se pudo obtener el ID del docente");
            }

            const response = await api.get(`/examen/mis-examenes-docente/${user.idUsuario}`);
            console.log("Respuesta de exámenes del docente:", response.data);
            if (response.data.success) {
                setExamenes(response.data.data);
            } else {
                console.error("Error al cargar exámenes del docente:", response.data.message);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.data.message || 'Error al cargar los exámenes del docente',
                    confirmButtonColor: '#7c3aed'
                });
                setExamenes([]);
            }
        } catch (error) {
            console.error("Error al cargar exámenes del docente:", error);
            const mensajeError = error.response 
                ? `Error ${error.response.status}: ${error.response.data?.message || 'Error desconocido'}`
                : 'No se pudo conectar con el servidor';
            
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: mensajeError,
                confirmButtonColor: '#7c3aed'
            });
            setExamenes([]);
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
                    <h1 className="text-3xl font-bold text-indigo-800 font-heading">
                        Mis Exámenes
                    </h1>
            
                </div>

                {/* Lista de Exámenes */}
                {examenes.length === 0 ? (
                    <div className="text-center text-gray-600 py-10">
                        <p className="text-lg mb-4">Aún no has creado ningún examen.</p>
                        <Link 
                            to="/crear-examen"
                            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300"
                        >
                            Crear mi primer examen
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {examenes.map(examen => (
                            <ExamenCard 
                                key={examen.idExamen}
                                examen={examen}
                                onView={() => navigate(`/ver-examen/${examen.idExamen}`)}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
        </Layout>
    );
};

export default ExamenesDocente; 