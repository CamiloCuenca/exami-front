import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/navbar';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Swal from 'sweetalert2';

const CrearExamen = () => {
    const navigate = useNavigate();
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
        idCategoria: 1,
        intentosPermitidos: 1,
        mostrarResultados: true,
        permitirRetroalimentacion: true,
        idTema: 1
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

        // --- Validaciones de Frontend ---
        if (!formData.nombre) {
             Swal.fire({ icon: 'error', title: 'Error de validación', text: 'El nombre del examen es obligatorio.', confirmButtonColor: '#7c3aed' });
             setIsLoading(false); return;
        }

        if (formData.nombre.length > 100) {
             Swal.fire({ icon: 'error', title: 'Error de validación', text: 'El nombre del examen no puede exceder los 100 caracteres.', confirmButtonColor: '#7c3aed' });
             setIsLoading(false); return;
        }

         if (formData.descripcion && formData.descripcion.length > 500) {
             Swal.fire({ icon: 'error', title: 'Error de validación', text: 'La descripción del examen no puede exceder los 500 caracteres.', confirmButtonColor: '#7c3aed' });
             setIsLoading(false); return;
        }

        if (!formData.fechaInicio || !formData.fechaFin) {
             Swal.fire({ icon: 'error', title: 'Error de validación', text: 'Las fechas de inicio y fin son obligatorias.', confirmButtonColor: '#7c3aed' });
             setIsLoading(false); return;
        }

        const fechaInicio = new Date(formData.fechaInicio);
        const fechaFin = new Date(formData.fechaFin);

        if (fechaInicio >= fechaFin) {
             Swal.fire({ icon: 'error', title: 'Error de validación', text: 'La fecha de inicio debe ser anterior a la fecha de fin.', confirmButtonColor: '#7c3aed' });
             setIsLoading(false); return;
        }

        const tiempoLimite = parseInt(formData.tiempoLimite);
        if (isNaN(tiempoLimite) || tiempoLimite <= 0) {
             Swal.fire({ icon: 'error', title: 'Error de validación', text: 'El tiempo límite debe ser un número mayor a 0.', confirmButtonColor: '#7c3aed' });
             setIsLoading(false); return;
        }

         const pesoCurso = parseFloat(formData.pesoCurso);
        if (isNaN(pesoCurso) || pesoCurso <= 0 || pesoCurso > 100) {
             Swal.fire({ icon: 'error', title: 'Error de validación', text: 'El peso del curso debe ser un número entre 1 y 100.', confirmButtonColor: '#7c3aed' });
             setIsLoading(false); return;
        }

        const umbralAprobacion = parseFloat(formData.umbralAprobacion); // Usar parseFloat como en el backend DTO
        if (isNaN(umbralAprobacion) || umbralAprobacion < 0 || umbralAprobacion > 100) {
             Swal.fire({ icon: 'error', title: 'Error de validación', text: 'El umbral de aprobación debe ser un número entre 0 y 100.', confirmButtonColor: '#7c3aed' });
             setIsLoading(false); return;
        }

        const cantidadPreguntasTotal = parseInt(formData.cantidadPreguntasTotal);
        if (isNaN(cantidadPreguntasTotal) || cantidadPreguntasTotal <= 0) {
             Swal.fire({ icon: 'error', title: 'Error de validación', text: 'La cantidad total de preguntas debe ser un número mayor a 0.', confirmButtonColor: '#7c3aed' });
             setIsLoading(false); return;
        }

        const cantidadPreguntasPresentar = parseInt(formData.cantidadPreguntasPresentar);
         if (isNaN(cantidadPreguntasPresentar) || cantidadPreguntasPresentar <= 0) {
             Swal.fire({ icon: 'error', title: 'Error de validación', text: 'La cantidad de preguntas a presentar debe ser un número mayor a 0.', confirmButtonColor: '#7c3aed' });
             setIsLoading(false); return;
        }

        if (cantidadPreguntasPresentar > cantidadPreguntasTotal) {
             Swal.fire({ icon: 'error', title: 'Error de validación', text: 'La cantidad de preguntas a presentar no puede ser mayor a la cantidad total.', confirmButtonColor: '#7c3aed' });
             setIsLoading(false); return;
        }

        const intentosPermitidos = parseInt(formData.intentosPermitidos);
        // Permitimos que sea NaN si el campo no es required y se deja vacío, pero si tiene valor, debe ser > 0
        if (!isNaN(intentosPermitidos) && intentosPermitidos <= 0) {
             Swal.fire({ icon: 'error', title: 'Error de validación', text: 'Los intentos permitidos deben ser un número mayor a 0.', confirmButtonColor: '#7c3aed' });
             setIsLoading(false); return;
        }

        // --- Fin Validaciones de Frontend ---

        const examenData = {
            idDocente: user.idUsuario,
            idTema: parseInt(formData.idTema), // Asegúrate de que el campo idTema exista en tu formulario y estado formData
            nombre: formData.nombre,
            descripcion: formData.descripcion,
            fechaInicio: formData.fechaInicio, // Formato 'YYYY-MM-DDTHH:mm' compatible con LocalDateTime
            fechaFin: formData.fechaFin,       // Formato 'YYYY-MM-DDTHH:mm' compatible con LocalDateTime
            tiempoLimite: tiempoLimite, 
            pesoCurso: pesoCurso,     
            umbralAprobacion: umbralAprobacion, 
            cantidadPreguntasTotal: cantidadPreguntasTotal, 
            cantidadPreguntasPresentar: cantidadPreguntasPresentar,
            idCategoria: parseInt(formData.idCategoria), // Asegúrate de que el campo idCategoria exista
            intentosPermitidos: isNaN(intentosPermitidos) ? 1 : intentosPermitidos, // Usar valor por defecto si es NaN (campo vacío)
            mostrarResultados: formData.mostrarResultados ? 1 : 0, 
            permitirRetroalimentacion: formData.permitirRetroalimentacion ? 1 : 0 
        };

        console.log("Datos a enviar para crear examen:", examenData); // Log para depuración

        try {
            // Asegúrate de que esta URL sea la correcta según tu controlador de backend
            const response = await api.post("/examen/crear-examen", examenData); 

            console.log("Respuesta del backend al crear examen:", response.data); // Log de la respuesta completa

            if (response.data.data && response.data.data.codigoResultado === 0) { 
                const idExamen = response.data.data.idExamen;
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: 'Examen creado correctamente. Ahora agrega las preguntas.',
                    confirmButtonColor: '#7c3aed',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    timer: 1500,
                    showConfirmButton: false
                });
                setTimeout(() => {
                    if (idExamen) {
                        navigate(`/formulario-pregunta/${idExamen}`);
                    } else {
                        navigate(`/formulario-pregunta/${idExamen}`);
                    }
                }, 1600);
            } else {
                // Manejar errores de validación del backend o errores internos del servicio
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
            
            <main className="container mx-auto px-4 py-8 mt-10">
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
                                    maxLength="100" // Validación de longitud
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
                                    maxLength="500" // Validación de longitud
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            {/* Campo para idTema - Debes añadir un selector o input para esto */}
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tema
                                </label>
                                {/* Aquí podrías tener un select cargado con los temas */}
                                <input
                                    type="number"
                                    name="idTema"
                                    value={formData.idTema}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="ID del Tema"
                                />
                            </div>
                             {/* Campo para idCategoria - Debes añadir un selector o input para esto */}
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Categoría
                                </label>
                                {/* Aquí podrías tener un select cargado con las categorías */}
                                <input
                                    type="number"
                                    name="idCategoria"
                                    value={formData.idCategoria}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="ID de la Categoría"
                                />
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
                                    min="1" // Añadir validación min en el input
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
                                disabled={isLoading}
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