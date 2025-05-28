import React, { useState } from 'react';
import preguntaService from '../services/preguntaService';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import { motion } from 'framer-motion';
import { useCategoriasTemas } from '../hooks/useCategoriasTemas';
import { useNivelesTipos } from '../hooks/useNivelesTipos';

const FormularioPregunta = () => {
    const navigate = useNavigate();
    const { temas, isLoading: isLoadingTemas } = useCategoriasTemas();
    const { nivelesDificultad, tiposPregunta, isLoading } = useNivelesTipos();
    const [form, setForm] = useState({
        idDocente: '',
        idTema: '',
        idNivelDificultad: '',
        idTipoPregunta: '',
        textoPregunta: '',
        esPublica: 0,
        tiempoMaximo: '',
        porcentaje: 100,
        idPreguntaPadre: null,
        textosOpciones: ['', '', '', ''],
        sonCorrectas: [0, 0, 0, 0],
        ordenes: [1, 2, 3, 4]
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
        }));
    };

    const handleOpcionChange = (idx, value) => {
        const nuevasOpciones = [...form.textosOpciones];
        nuevasOpciones[idx] = value;
        setForm(prev => ({ ...prev, textosOpciones: nuevasOpciones }));
    };

    const handleCorrectaChange = (idx, checked) => {
        const nuevasCorrectas = [...form.sonCorrectas];
        nuevasCorrectas[idx] = checked ? 1 : 0;
        setForm(prev => ({ ...prev, sonCorrectas: nuevasCorrectas }));
    };

    // Validación según el tipo de pregunta
    const validarFormulario = () => {
        const tipo = tiposPregunta.find(t => t.idTipoPregunta === Number(form.idTipoPregunta));
        if (!tipo) {
            Swal.fire('Error', 'Debes seleccionar un tipo de pregunta', 'error');
            return false;
        }

        // Selección múltiple: al menos una correcta
        if (tipo.nombre === 'Selección múltiple') {
            if (!form.sonCorrectas.some(c => c === 1)) {
                Swal.fire('Error', 'Debes marcar al menos una opción como correcta', 'error');
                return false;
            }
        }

        // Selección única: solo una correcta
        if (tipo.nombre === 'Selección única') {
            const correctas = form.sonCorrectas.filter(c => c === 1).length;
            if (correctas !== 1) {
                Swal.fire('Error', 'Debes marcar exactamente una opción como correcta', 'error');
                return false;
            }
        }

        // Falso/Verdadero: solo dos opciones, solo una correcta, textos exactos
        if (tipo.nombre === 'Falso/Verdadero') {
            if (
                form.textosOpciones[0].trim().toLowerCase() !== 'verdadero' ||
                form.textosOpciones[1].trim().toLowerCase() !== 'falso'
            ) {
                Swal.fire('Error', 'Las opciones deben ser "Verdadero" y "Falso"', 'error');
                return false;
            }
            const correctas = form.sonCorrectas[0] + form.sonCorrectas[1];
            if (correctas !== 1) {
                Swal.fire('Error', 'Debes marcar solo una opción como correcta en Falso/Verdadero', 'error');
                return false;
            }
            if (form.textosOpciones.length !== 4) {
                Swal.fire('Error', 'Debe haber exactamente dos opciones en Falso/Verdadero', 'error');
                return false;
            }
        }

        // Validar que los arrays tengan la misma longitud
        if (
            form.textosOpciones.length !== form.sonCorrectas.length ||
            form.textosOpciones.length !== form.ordenes.length
        ) {
            Swal.fire('Error', 'Las listas de textos, corrección y órdenes deben tener la misma longitud', 'error');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validarFormulario()) return;
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.idUsuario) {
                Swal.fire('Error', 'No se encontró el usuario docente', 'error');
                return;
            }
            let data = {
                ...form,
                idDocente: user.idUsuario,
                textosOpciones: form.textosOpciones,
                sonCorrectas: form.sonCorrectas,
                ordenes: form.ordenes
            };
            // Ajuste para Falso/Verdadero: solo dos opciones
            const tipo = tiposPregunta.find(t => t.idTipoPregunta === Number(form.idTipoPregunta));
            if (tipo && tipo.nombre === 'Falso/Verdadero') {
                data.textosOpciones = form.textosOpciones.slice(0, 2);
                data.sonCorrectas = form.sonCorrectas.slice(0, 2);
                data.ordenes = form.ordenes.slice(0, 2);
            }
            const response = await preguntaService.agregarPregunta(data);
            if (response.success && response.data.codigoResultado === 0) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: 'Pregunta agregada correctamente',
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
                Swal.fire('Error', response.data?.mensajeResultado || 'No se pudo agregar la pregunta', 'error');
            }
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'Error de conexión', 'error');
        }
    };

    // Renderizado dinámico de opciones de respuesta
    const renderOpcionesRespuesta = () => {
        const tipo = tiposPregunta.find(t => t.idTipoPregunta === Number(form.idTipoPregunta));
        if (!tipo) return null;

        if (tipo.nombre === 'Selección múltiple') {
            return (
                <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-indigo-700 font-heading">Opciones de Respuesta</h2>
                    {form.textosOpciones.map((op, idx) => (
                        <div key={idx} className="flex items-center space-x-2 mb-2">
                            <input
                                type="text"
                                value={op}
                                onChange={e => handleOpcionChange(idx, e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder={`Opción ${idx + 1}`}
                                required
                            />
                            <label className="flex items-center space-x-1">
                                <input
                                    type="checkbox"
                                    checked={!!form.sonCorrectas[idx]}
                                    onChange={e => handleCorrectaChange(idx, e.target.checked)}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                /> <span>Correcta</span>
                            </label>
                        </div>
                    ))}
                </div>
            );
        } else if (tipo.nombre === 'Selección única') {
            return (
                <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-indigo-700 font-heading">Opciones de Respuesta</h2>
                    {form.textosOpciones.map((op, idx) => (
                        <div key={idx} className="flex items-center space-x-2 mb-2">
                            <input
                                type="text"
                                value={op}
                                onChange={e => handleOpcionChange(idx, e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder={`Opción ${idx + 1}`}
                                required
                            />
                            <label className="flex items-center space-x-1">
                                <input
                                    type="radio"
                                    name="opcionCorrecta"
                                    checked={form.sonCorrectas[idx] === 1}
                                    onChange={() => {
                                        const nuevasCorrectas = [0, 0, 0, 0];
                                        nuevasCorrectas[idx] = 1;
                                        setForm(prev => ({ ...prev, sonCorrectas: nuevasCorrectas }));
                                    }}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                /> <span>Correcta</span>
                            </label>
                        </div>
                    ))}
                </div>
            );
        } else if (tipo.nombre === 'Falso/Verdadero') {
            return (
                <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-indigo-700 font-heading">Respuesta</h2>
                    <div className="flex space-x-4">
                        <label>
                            <input
                                type="radio"
                                name="respuestaVF"
                                checked={form.sonCorrectas[0] === 1}
                                onChange={() => setForm(prev => ({
                                    ...prev,
                                    textosOpciones: ['Verdadero', 'Falso', '', ''],
                                    sonCorrectas: [1, 0, 0, 0]
                                }))}
                            /> Verdadero
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="respuestaVF"
                                checked={form.sonCorrectas[1] === 1}
                                onChange={() => setForm(prev => ({
                                    ...prev,
                                    textosOpciones: ['Verdadero', 'Falso', '', ''],
                                    sonCorrectas: [0, 1, 0, 0]
                                }))}
                            /> Falso
                        </label>
                    </div>
                </div>
            );
        }
        return null;
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
                        Agregar Pregunta
                    </h1>
                    <form onSubmit={handleSubmit} className="space-y-6 font-sans">
                        {/* Información Básica */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-indigo-700 font-heading">Información Básica</h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tema</label>
                                <select
                                    name="idTema"
                                    value={form.idTema}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nivel de Dificultad
                                </label>
                                <select
                                    name="idNivelDificultad"
                                    value={form.idNivelDificultad}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                                    required
                                >
                                    <option value="">Seleccione un nivel</option>
                                    {nivelesDificultad.map((nivel) => (
                                        <option key={nivel.idNivelDificultad} value={nivel.idNivelDificultad}>
                                            {nivel.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tipo de Pregunta
                                </label>
                                <select
                                    name="idTipoPregunta"
                                    value={form.idTipoPregunta}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                                    required
                                >
                                    <option value="">Seleccione un tipo</option>
                                    {tiposPregunta.map((tipo) => (
                                        <option key={tipo.idTipoPregunta} value={tipo.idTipoPregunta}>
                                            {tipo.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Texto de la Pregunta</label>
                                <textarea 
                                    name="textoPregunta" 
                                    value={form.textoPregunta} 
                                    onChange={handleChange} 
                                    required 
                                    rows="3" 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                                />
                            </div>
                        </div>
                        {/* Opciones y Configuración */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">¿Es pública?</label>
                                <div className="flex items-center">
                                    <input 
                                        type="checkbox" 
                                        name="esPublica" 
                                        checked={!!form.esPublica} 
                                        onChange={handleChange} 
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" 
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Marcar si la pregunta es pública</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tiempo Máximo (segundos)</label>
                                <input 
                                    type="number" 
                                    name="tiempoMaximo" 
                                    value={form.tiempoMaximo} 
                                    onChange={handleChange} 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Porcentaje</label>
                                <input 
                                    type="number" 
                                    name="porcentaje" 
                                    value={form.porcentaje} 
                                    onChange={handleChange} 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                                />
                            </div>
                        </div>
                        {/* Opciones de Respuesta */}
                        {renderOpcionesRespuesta()}
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
                                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Guardando...' : 'Guardar Pregunta'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </main>
        </div>
    );
};

export default FormularioPregunta;