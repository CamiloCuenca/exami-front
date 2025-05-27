import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/navbar';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { BookOpen, CheckCircle, Users, BarChart2 } from 'react-feather';
import ExamenCard from '../components/ExamenCard';

const HomeProfe = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [estadisticas, setEstadisticas] = useState({
        totalExamenes: 0,
        examenesActivos: 0,
        totalEstudiantes: 0,
        promedioNotas: 0
    });
    const [examenes, setExamenes] = useState([]);
    const [isLoadingExamenes, setIsLoadingExamenes] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || user.tipoUsuario !== "Docente") {
            navigate("/login");
            return;
        }
        cargarEstadisticas();
        cargarExamenesDocente();
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

    const cargarExamenesDocente = async () => {
        setIsLoadingExamenes(true);
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
            setIsLoadingExamenes(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.idUsuario) {
            Swal.fire({
                icon: 'error',
                title: 'Error de autenticación',
                text: 'No se pudo obtener el ID del docente.',
                confirmButtonColor: '#7c3aed'
            });
            setIsLoading(false);
            return;
        }
        
        const examenData = {
            idDocente: user.idUsuario, // Obtener del usuario autenticado
            idTema: parseInt(formData.idTema), // Asegúrate de que el campo idTema exista en tu formulario y estado formData
            nombre: formData.nombre,
            descripcion: formData.descripcion,
            fechaInicio: formData.fechaInicio, // Asegúrate de que el formato sea ISO 8601 o compatible con el backend
            fechaFin: formData.fechaFin,       // Asegúrate de que el formato sea ISO 8601 o compatible con el backend
            tiempoLimite: parseInt(formData.tiempoLimite), // Convertir a número
            pesoCurso: parseFloat(formData.pesoCurso),     // Convertir a número (si es decimal)
            umbralAprobacion: parseInt(formData.umbralAprobacion), // Convertir a número
            cantidadPreguntasTotal: parseInt(formData.cantidadPreguntasTotal), // Convertir a número
            cantidadPreguntasPresentar: parseInt(formData.cantidadPreguntasPresentar), // Convertir a número
            idCategoria: parseInt(formData.idCategoria), // Asegúrate de que el campo idCategoria exista
            intentosPermitidos: parseInt(formData.intentosPermitidos), // Convertir a número
            mostrarResultados: formData.mostrarResultados === '1', // Convertir a booleano si el backend espera boolean
            permitirRetroalimentacion: formData.permitirRetroalimentacion === '1' // Convertir a booleano
        };

        console.log("Datos a enviar para crear examen:", examenData); // Log para depuración

        try {
            const response = await api.post("/examen/crear-examen/", examenData); // Endpoint de creación

            if (response.data.codigoResultado === 1) { // Suponiendo que 1 es COD_EXITO
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: 'Examen creado correctamente.',
                    confirmButtonColor: '#7c3aed'
                });
                // Opcional: Redirigir o actualizar la lista de exámenes
                // navigate("/home-profe"); 
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.data.mensajeResultado || 'Error desconocido al crear el examen.',
                    confirmButtonColor: '#7c3aed'
                });
            }

        } catch (error) {
            console.error("Error al crear examen:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'No se pudo conectar con el servidor para crear el examen.',
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
            
            <main className="container mx-auto px-4 py-8 mt-10">
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
                            title: "Gestionar Temas/Cursos",
                            description: "Organiza tus exámenes por temas y cursos",
                            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm0 0L5.84 10.578a12.078 12.078 0 00-.665 6.479 11.952 11.952 0 006.824 2.998 12.083 12.083 0 01-.665-6.479L12 14z" />
                                </svg>,
                            link: "/gestionar-temas"
                        },
                        {
                            title: "Ver Reportes",
                            description: "Analiza el rendimiento de tus estudiantes",
                            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14m-6 0a2 2 0 002 2h2a2 2 0 002-2z" />
                                </svg>,
                            link: "/reportes"
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
                                {/* Icono */}
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

                {/* Sección de Exámenes del Docente */}
                <section className="mt-12 font-sans">
                    <h2 className="text-2xl font-bold text-indigo-800 mb-6 font-heading">Mis Exámenes Creados</h2>
                    {isLoadingExamenes ? (
                         <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                         </div>
                    ) : examenes.length === 0 ? (
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
                </section>

            </main>
        </div>
    );
};

export default HomeProfe; 