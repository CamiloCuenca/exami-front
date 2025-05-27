import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/navbar';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Swal from 'sweetalert2';
import { useCategoriasTemas } from '../hooks/useCategoriasTemas';

const CrearExamen = () => {
    const navigate = useNavigate();
    const { categorias, temas, isLoading: isLoadingCategoriasTemas } = useCategoriasTemas();
    const [isLoading, setIsLoading] = useState(false);
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

            if (response.data.success && response.data.data.codigoResultado === 0) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: 'Examen creado correctamente.',
                    confirmButtonColor: '#7c3aed',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    timer: 1500,
                    showConfirmButton: false
                });
                setTimeout(() => {
                    navigate('/home-profe');
                }, 1600);
            } else {
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
            <Navbar />
            
            <main className="container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8"
                >
                    <h1 className="text-3xl font-bold text-indigo-800 mb-8 text-center font-heading">
                        Crear Nuevo Examen
                    </h1>

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
                </motion.div>
            </main>
        </div>
    );
};

export default CrearExamen;