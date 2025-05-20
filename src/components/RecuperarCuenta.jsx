import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import {
    RECUPERACION_EXITOSA,
    RECUPERACION_USUARIO_NO_ENCONTRADO,
    RECUPERACION_CUENTA_NO_BLOQUEADA,
    RECUPERACION_ERROR_INESPERADO
} from "../constants/auth";

export default function RecuperarCuenta() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formError, setFormError] = useState(null);

    const handleRecuperarCuenta = async (event) => {
        event.preventDefault();
        setFormError(null);
        setIsLoading(true);

        const form = event.target;
        const email = form.email.value;
        const contrasena = form.contrasena.value;

        // Validación básica
        if (!email || !email.includes('@')) {
            setFormError('Por favor ingresa un email válido');
            setIsLoading(false);
            return;
        }

        if (!contrasena || contrasena.length < 6) {
            setFormError('La contraseña debe tener al menos 6 caracteres');
            setIsLoading(false);
            return;
        }

        try {
            const response = await api.post("/auth/recuperar-cuenta", { email, contrasena });
            
            switch (response.data.codigoResultado) {
                case RECUPERACION_EXITOSA:
                    Swal.fire({
                        icon: 'success',
                        title: '¡Cuenta recuperada!',
                        text: 'Tu cuenta ha sido desbloqueada exitosamente.',
                        showConfirmButton: false,
                        timer: 1500,
                        background: '#fff'
                    });

                    // Redirigir al login después de mostrar el mensaje
                    setTimeout(() => {
                        navigate("/login");
                    }, 1600);
                    break;

                case RECUPERACION_USUARIO_NO_ENCONTRADO:
                    Swal.fire({
                        icon: 'error',
                        title: 'Usuario no encontrado',
                        text: 'No existe una cuenta con ese correo electrónico.',
                        confirmButtonColor: '#7c3aed',
                        background: '#fff'
                    });
                    break;

                case RECUPERACION_CUENTA_NO_BLOQUEADA:
                    Swal.fire({
                        icon: 'warning',
                        title: 'Cuenta no bloqueada',
                        text: 'Esta cuenta no está bloqueada. Puedes iniciar sesión normalmente.',
                        confirmButtonColor: '#7c3aed',
                        background: '#fff'
                    });
                    break;

                case RECUPERACION_ERROR_INESPERADO:
                default:
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.data.mensajeResultado || 'Ocurrió un error al intentar recuperar la cuenta',
                        confirmButtonColor: '#7c3aed',
                        background: '#fff'
                    });
            }
        } catch (error) {
            console.error("Error al recuperar cuenta:", error);
            
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.mensajeResultado || 'Ocurrió un error al intentar recuperar la cuenta',
                confirmButtonColor: '#7c3aed',
                background: '#fff'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 pt-12 relative overflow-hidden"
            >
                {/* Elemento decorativo superior */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-500"></div>

                {/* Botón de regreso */}
                <motion.button
                    whileHover={{ scale: 1.1, x: -3 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/login")}
                    className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none z-10"
                    aria-label="Regresar al login"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        style={{ color: "#7c3aed" }}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </motion.button>

                <motion.h1 
                    className="text-3xl font-bold text-center mb-8 text-indigo-800"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                >
                    Desbloquear Cuenta
                </motion.h1>

                <motion.p
                    className="text-center text-gray-600 mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                >
                    Ingresa tu correo electrónico y contraseña actual para desbloquear tu cuenta
                </motion.p>

                <form onSubmit={handleRecuperarCuenta} className="space-y-6">
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                    >
                        <label
                            htmlFor="email"
                            className="block text-sm font-semibold text-indigo-800 mb-1"
                        >
                            Email
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                            </div>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 transition-all"
                                placeholder="ejemplo@correo.com"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                    >
                        <label
                            htmlFor="contrasena"
                            className="block text-sm font-semibold text-indigo-800 mb-1"
                        >
                            Contraseña Actual
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <input
                                type="password"
                                id="contrasena"
                                name="contrasena"
                                required
                                className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 transition-all"
                                placeholder="Ingresa tu contraseña actual"
                            />
                        </div>
                    </motion.div>

                    {formError && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded"
                        >
                            {formError}
                        </motion.div>
                    )}

                    <motion.button
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.5 }}
                        whileHover={{ scale: 1.03, boxShadow: "0px 5px 15px rgba(124, 58, 237, 0.4)" }}
                        whileTap={{ scale: 0.97 }}
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 rounded-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <motion.svg 
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="-ml-1 mr-2 h-5 w-5 text-white" 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    fill="none" 
                                    viewBox="0 0 24 24"
                                >
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </motion.svg>
                                Procesando...
                            </span>
                        ) : "Recuperar Cuenta"}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
} 