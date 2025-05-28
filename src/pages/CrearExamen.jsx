import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/navbar';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Swal from 'sweetalert2';
import Layout from '../components/Layout';
import { useCategoriasTemas } from '../hooks/useCategoriasTemas';
import AsignarPreguntasExamen from '../components/AsignarPreguntasExamen';

const CrearExamen = () => {
    const navigate = useNavigate();
    const { categorias, temas, isLoading: isLoadingCategoriasTemas } = useCategoriasTemas();
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        fechaInicio: '',
        fechaFin: '',
        tiempoLimite: 60,
        pesoCurso: 1.0,
        umbralAprobacion: 60,
        cantidadPreguntasTotal: 10,
        cantidadPreguntasPresentar: 10,
        id_categoria: '',
        intentosPermitidos: 1,
        mostrarResultados: true,
        permitirRetroalimentacion: true,
        id_tema: ''
    });
    const [pasoActual, setPasoActual] = useState(1);
    const [idExamenCreado, setIdExamenCreado] = useState(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user"));
        if (!userData || !userData.idUsuario) {
            Swal.fire({
                icon: 'error',
                title: 'Error de autenticación',
                text: 'No se pudo obtener la información del usuario.',
                confirmButtonColor: '#7c3aed'
            });
            navigate('/login');
            return;
        }
        setUser(userData);
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
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

        // Validaciones
        if (!formData.nombre) {
            Swal.fire({
                icon: 'error',
                title: 'Error de validación',
                text: 'El nombre del examen es obligatorio.',
                confirmButtonColor: '#7c3aed'
            });
            setIsLoading(false);
            return;
        }

        if (!formData.id_tema) {
            Swal.fire({
                icon: 'error',
                title: 'Error de validación',
                text: 'Debe seleccionar un tema.',
                confirmButtonColor: '#7c3aed'
            });
            setIsLoading(false);
            return;
        }

        if (!formData.id_categoria) {
            Swal.fire({
                icon: 'error',
                title: 'Error de validación',
                text: 'Debe seleccionar una categoría.',
                confirmButtonColor: '#7c3aed'
            });
            setIsLoading(false);
            return;
        }

        const examenData = {
            idDocente: user.idUsuario,
            idTema: parseInt(formData.id_tema),
            nombre: formData.nombre,
            descripcion: formData.descripcion,
            fechaInicio: formData.fechaInicio,
            fechaFin: formData.fechaFin,
            tiempoLimite: parseInt(formData.tiempoLimite),
            pesoCurso: parseFloat(formData.pesoCurso),
            umbralAprobacion: parseFloat(formData.umbralAprobacion),
            cantidadPreguntasTotal: parseInt(formData.cantidadPreguntasTotal),
            cantidadPreguntasPresentar: parseInt(formData.cantidadPreguntasPresentar),
            idCategoria: parseInt(formData.id_categoria),
            intentosPermitidos: parseInt(formData.intentosPermitidos),
            mostrarResultados: formData.mostrarResultados ? 1 : 0,
            permitirRetroalimentacion: formData.permitirRetroalimentacion ? 1 : 0
        };

        try {
            const response = await api.post("/examen/crear-examen", examenData);
            console.log("Respuesta del backend al crear examen:", response.data);

            if (response.data.success && response.data.data.codigoResultado === 0) {
                const idExamen = response.data.data.idExamenCreado;
                console.log("ID del examen creado:", idExamen);
                
                if (!idExamen) {
                    throw new Error('No se recibió el ID del examen creado');
                }

                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: 'Examen creado correctamente. Ahora asigne las preguntas.',
                    confirmButtonColor: '#7c3aed',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    timer: 1500,
                    showConfirmButton: false
                });
                
                // Guardamos el ID del examen y avanzamos al paso 2
                handleExamenCreado(idExamen);
            } else {
                console.error("Error en la respuesta del backend:", response.data);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al crear examen',
                    text: response.data.data?.mensajeResultado || response.data.message || 'Error desconocido al crear el examen.',
                    confirmButtonColor: '#7c3aed'
                });
            }
        } catch (error) {
            console.error("Error en la llamada a la API para crear examen:", error);
            const mensajeError = error.response 
                ? `Error ${error.response.status}: ${error.response.data?.message || 'Error desconocido'}`
                : 'No se pudo conectar con el servidor. Verifique que el backend esté activo.';
            
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

    const handleExamenCreado = (idExamen) => {
        console.log("Manejando examen creado con ID:", idExamen);
        if (!idExamen) {
            console.error("Error: ID del examen es null o undefined");
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo obtener el ID del examen creado',
                confirmButtonColor: '#7c3aed'
            });
            return;
        }
        setIdExamenCreado(idExamen);
        setPasoActual(2);
    };

    const handlePreguntasAsignadas = () => {
        navigate('/examenes-docente');
    };

    return (
        <Layout>
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
            <Navbar />
            
            <main className="container mx-auto px-4 py-8 mt-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8"
                >
                    <h1 className="text-3xl font-bold text-indigo-800 mb-8 text-center font-heading">
                        Crear Nuevo Examen
                    </h1>

                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-indigo-700 font-heading">
                            Paso {pasoActual} de 2
                        </h2>
                        <div className="mt-2 flex items-center space-x-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                pasoActual >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
                            }`}>
                                1
                            </div>
                            <div className="flex-1 h-1 bg-gray-200">
                                <div className={`h-full ${
                                    pasoActual >= 2 ? 'bg-indigo-600' : 'bg-gray-200'
                                }`} style={{ width: pasoActual >= 2 ? '100%' : '0%' }}></div>
                            </div>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                pasoActual >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
                            }`}>
                                2
                            </div>
                        </div>
                    </div>

                    {pasoActual === 1 ? (
                        <form onSubmit={handleSubmit} className="space-y-6 font-sans">
                            {/* Información Básica */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-indigo-700 font-heading">Información Básica</h2>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nombre del Examen
                                    </label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        required
                                        maxLength="100"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Descripción
                                    </label>
                                    <textarea
                                        name="descripcion"
                                        value={formData.descripcion}
                                        onChange={handleChange}
                                        rows="3"
                                        maxLength="500"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tema
                                    </label>
                                    <select
                                        name="id_tema"
                                        value={formData.id_tema}
                                        onChange={handleChange}
                                        required
                                        disabled={isLoadingCategoriasTemas}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="">Seleccione un tema</option>
                                        {temas.map(tema => (
                                            <option key={tema.id_tema} value={tema.id_tema}>
                                                {tema.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Categoría
                                    </label>
                                    <select
                                        name="id_categoria"
                                        value={formData.id_categoria}
                                        onChange={handleChange}
                                        required
                                        disabled={isLoadingCategoriasTemas}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="">Seleccione una categoría</option>
                                        {categorias.map(cat => (
                                            <option key={cat.id_categoria} value={cat.id_categoria}>
                                                {cat.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Fechas y Tiempo */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Fecha de Inicio
                                    </label>
                                    <input
                                        type="datetime-local"
                                        name="fechaInicio"
                                        value={formData.fechaInicio}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Fecha de Fin
                                    </label>
                                    <input
                                        type="datetime-local"
                                        name="fechaFin"
                                        value={formData.fechaFin}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tiempo Límite (minutos)
                                    </label>
                                    <input
                                        type="number"
                                        name="tiempoLimite"
                                        value={formData.tiempoLimite}
                                        onChange={handleChange}
                                        required
                                        min="1"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            {/* Configuración del Examen */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Peso en el Curso (%)
                                    </label>
                                    <input
                                        type="number"
                                        name="pesoCurso"
                                        value={formData.pesoCurso}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        max="100"
                                        step="0.1"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Umbral de Aprobación (%)
                                    </label>
                                    <input
                                        type="number"
                                        name="umbralAprobacion"
                                        value={formData.umbralAprobacion}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        max="100"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Total de Preguntas
                                    </label>
                                    <input
                                        type="number"
                                        name="cantidadPreguntasTotal"
                                        value={formData.cantidadPreguntasTotal}
                                        onChange={handleChange}
                                        required
                                        min="1"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Preguntas a Presentar
                                    </label>
                                    <input
                                        type="number"
                                        name="cantidadPreguntasPresentar"
                                        value={formData.cantidadPreguntasPresentar}
                                        onChange={handleChange}
                                        required
                                        min="1"
                                        max={formData.cantidadPreguntasTotal}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            {/* Opciones Adicionales */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Intentos Permitidos
                                    </label>
                                    <input
                                        type="number"
                                        name="intentosPermitidos"
                                        value={formData.intentosPermitidos}
                                        onChange={handleChange}
                                        min="1"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div className="flex items-center space-x-4">
                                    <input
                                        type="checkbox"
                                        name="mostrarResultados"
                                        checked={formData.mostrarResultados}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label className="text-sm font-medium text-gray-700">
                                        Mostrar resultados después del examen
                                    </label>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <input
                                        type="checkbox"
                                        name="permitirRetroalimentacion"
                                        checked={formData.permitirRetroalimentacion}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label className="text-sm font-medium text-gray-700">
                                        Permitir retroalimentación
                                    </label>
                                </div>
                            </div>

                            {/* Botones */}
                            <div className="flex justify-end space-x-4 pt-6">
                                <button
                                    type="button"
                                    onClick={() => navigate("/home-profe")}
                                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading || isLoadingCategoriasTemas}
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                >
                                    {isLoading ? 'Creando...' : 'Crear Examen'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            {user && (
                                <AsignarPreguntasExamen
                                    idExamen={idExamenCreado}
                                    idDocente={user.idUsuario}
                                    onPreguntasAsignadas={handlePreguntasAsignadas}
                                    umbralAprobacion={Number(formData.umbralAprobacion)}
                                    cantidadPreguntasTotal={Number(formData.cantidadPreguntasTotal)}
                                    cantidadPreguntasPresentar={Number(formData.cantidadPreguntasPresentar)}
                                />
                            )}
                        </div>
                    )}
                </motion.div>
            </main>
        </div>
        </Layout>
    );
};

export default CrearExamen;