import React, { useState } from 'react';
import preguntaService from '../services/preguntaService';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import { motion } from 'framer-motion';

const FormularioPregunta = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        idDocente: '', // Puedes obtenerlo del usuario logueado
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

    // Manejo de cambios en los campos
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
        }));
    };

    // Manejo de cambios en las opciones
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Aquí puedes obtener el idDocente del usuario logueado
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.idUsuario) {
                Swal.fire('Error', 'No se encontró el usuario docente', 'error');
                return;
            }
            const data = {
                ...form,
                idDocente: user.idUsuario,
                textosOpciones: form.textosOpciones,
                sonCorrectas: form.sonCorrectas,
                ordenes: form.ordenes
            };
            const response = await preguntaService.agregarPregunta(data);
            if (response.success && response.data.codigoResultado === 0) {
                Swal.fire('¡Éxito!', 'Pregunta agregada correctamente', 'success');
                navigate('/home-profe');
            } else {
                Swal.fire('Error', response.data?.mensajeResultado || 'No se pudo agregar la pregunta', 'error');
            }
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'Error de conexión', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
            <Navbar />
            <div className="flex items-center justify-center min-h-[80vh]">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 pt-12 relative overflow-hidden"
                >
                    {/* Elemento decorativo superior */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-500"></div>
                    {/* Círculos decorativos */}
                    <motion.div 
                        animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.6, 0.5] }}
                        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                        className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-indigo-100 opacity-50"
                    />
                    <motion.div 
                        animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.6, 0.5] }}
                        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 0.5 }}
                        className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-purple-100 opacity-50"
                    />
                    <motion.h1 
                        className="text-2xl font-bold text-center mb-8 text-indigo-800 relative z-10 font-heading"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                    >
                        Agregar Pregunta
                    </motion.h1>
                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10 font-sans">
                        <input type="hidden" name="idDocente" value={form.idDocente} />
                        <div>
                            <label className="block text-sm font-semibold text-indigo-800 mb-1">Tema</label>
                            <input type="number" name="idTema" value={form.idTema} onChange={handleChange} className="w-full pl-3 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 transition-all duration-200 text-gray-800 placeholder-gray-400" required />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-indigo-800 mb-1">Nivel de Dificultad</label>
                            <input type="number" name="idNivelDificultad" value={form.idNivelDificultad} onChange={handleChange} className="w-full pl-3 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 transition-all duration-200 text-gray-800 placeholder-gray-400" required />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-indigo-800 mb-1">Tipo de Pregunta</label>
                            <input type="number" name="idTipoPregunta" value={form.idTipoPregunta} onChange={handleChange} className="w-full pl-3 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 transition-all duration-200 text-gray-800 placeholder-gray-400" required />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-indigo-800 mb-1">Texto de la Pregunta</label>
                            <textarea name="textoPregunta" value={form.textoPregunta} onChange={handleChange} className="w-full pl-3 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 transition-all duration-200 text-gray-800 placeholder-gray-400" required />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-indigo-800 mb-1">¿Es pública?</label>
                            <input type="checkbox" name="esPublica" checked={!!form.esPublica} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-indigo-800 mb-1">Tiempo Máximo (segundos)</label>
                            <input type="number" name="tiempoMaximo" value={form.tiempoMaximo} onChange={handleChange} className="w-full pl-3 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 transition-all duration-200 text-gray-800 placeholder-gray-400" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-indigo-800 mb-1">Porcentaje</label>
                            <input type="number" name="porcentaje" value={form.porcentaje} onChange={handleChange} className="w-full pl-3 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 transition-all duration-200 text-gray-800 placeholder-gray-400" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-indigo-800 mb-1">Opciones de Respuesta</label>
                            {form.textosOpciones.map((op, idx) => (
                                <div key={idx} className="flex items-center space-x-2 mb-2">
                                    <input
                                        type="text"
                                        value={op}
                                        onChange={e => handleOpcionChange(idx, e.target.value)}
                                        className="border rounded-lg p-2 flex-1 bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 placeholder-gray-400"
                                        placeholder={`Opción ${idx + 1}`}
                                        required
                                    />
                                    <label className="flex items-center space-x-1">
                                        <input
                                            type="checkbox"
                                            checked={!!form.sonCorrectas[idx]}
                                            onChange={e => handleCorrectaChange(idx, e.target.checked)}
                                        /> <span>Correcta</span>
                                    </label>
                                </div>
                            ))}
                        </div>
                        <motion.button
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.5 }}
                            whileHover={{ scale: 1.03, boxShadow: "0px 5px 15px rgba(124, 58, 237, 0.4)" }}
                            whileTap={{ scale: 0.97 }}
                            type="submit"
                            className="w-full py-3 rounded-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
                        >
                            Guardar Pregunta
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default FormularioPregunta;