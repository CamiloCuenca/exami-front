import api from "../services/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    LOGIN_EXITOSO, 
    LOGIN_USUARIO_NO_ENCONTRADO, 
    LOGIN_CUENTA_INACTIVA, 
    LOGIN_CUENTA_BLOQUEADA, 
    LOGIN_CONTRASENA_INCORRECTA, 
    LOGIN_ERROR_INESPERADO 
} from "../constants/auth";

// Constante para controlar el modo de depuración - asegurarnos que nunca se muestre en producción
const IS_DEV_MODE = import.meta.env.MODE === 'development';

export default function Login() {
    const navigate = useNavigate();
    const [intentosFallidos, setIntentosFallidos] = useState(0);
    const [debugInfo, setDebugInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showDebug, setShowDebug] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formError, setFormError] = useState(null);

    // Mostrar información de debug si estamos en modo desarrollo
    useEffect(() => {
        if (debugInfo && debugInfo.codigoResultado === LOGIN_CONTRASENA_INCORRECTA) {
            mostrarAlertaIntentos();
        }
    }, [debugInfo]);

    const mostrarAlertaIntentos = () => {
        // Calcular intentos basados en la información del servidor o del estado local
        // Obtener intentos desde el mensaje del servidor si está disponible
        let intentosRestantes = 0;
        
        // Intentar extraer intentos restantes del mensaje si existe
        if (debugInfo && debugInfo.mensajeResultado) {
            const match = debugInfo.mensajeResultado.match(/Intentos restantes: (\d+)/);
            if (match && match[1]) {
                intentosRestantes = parseInt(match[1]);
            } else {
                // Si no hay información en el mensaje, usar el contador local
                const nuevosIntentos = intentosFallidos + 1;
                intentosRestantes = Math.max(0, 3 - nuevosIntentos);
            }
        } else {
            // Si no hay información del servidor, usar el contador local
            const nuevosIntentos = intentosFallidos + 1;
            intentosRestantes = Math.max(0, 3 - nuevosIntentos);
        }
        
        const progreso = ((3-intentosRestantes)/3)*100;
        
        Swal.fire({
            icon: 'warning',
            title: 'Contraseña incorrecta',
            html: `
                <div class="flex flex-col items-center">
                    <p class="mb-3 text-md">Contraseña no válida</p>
                    <div class="w-full bg-gray-200 rounded-full h-4 mb-2 dark:bg-gray-700 overflow-hidden">
                        <div class="h-4 rounded-full transition-all duration-700 animate-pulse" 
                            style="width: ${progreso}%; background-image: linear-gradient(to right, #ef4444, #b91c1c);"></div>
                    </div>
                    <p class="text-red-500 font-bold text-md">Te quedan ${intentosRestantes} ${intentosRestantes === 1 ? 'intento' : 'intentos'} antes de que tu cuenta sea bloqueada</p>
                </div>
            `,
            confirmButtonColor: '#7c3aed',
            background: '#fff',
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        });
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        setFormError(null);
        setIsLoading(true);
        const form = event.target;
        const email = form.email.value;
        const contrasena = form.contrasena.value;

        // Validación simple del formulario
        if (!email || !email.includes('@')) {
            setFormError('Por favor ingresa un email válido');
            setIsLoading(false);
            return;
        }

        try {
            const response = await api.post("/auth/login", { email, contrasena });
            
            // Solo guardamos información de depuración en desarrollo
            if (IS_DEV_MODE) {
                setDebugInfo({
                    codigoResultado: response.data.codigoResultado,
                    mensajeResultado: response.data.mensajeResultado,
                    datoExtra: response.data.datoExtra || null
                });
                console.log("Respuesta del servidor:", response.data);
            }

            if (response.data.codigoResultado === LOGIN_EXITOSO) {
                setIntentosFallidos(0);
                
                // Guardar la respuesta en localStorage
                localStorage.setItem("user", JSON.stringify(response.data));

                Swal.fire({
                    icon: 'success',
                    title: '¡Bienvenido!',
                    text: '¡Inicio de sesión exitoso!',
                    showConfirmButton: false,
                    timer: 1500,
                    background: '#fff',
                    customClass: {
                        popup: 'animated fadeInDown'
                    }
                });

                // Redirigir según el tipo de usuario después de que se cierre la alerta
                setTimeout(() => {
                    if (response.data.tipoUsuario === "Estudiante") {
                        navigate("/");
                    } else {
                        navigate("/homeProfe");
                    }
                }, 1600);
                
            } else {
                // Manejar diferentes códigos de error alineados con el backend
                switch(response.data.codigoResultado) {
                    case LOGIN_USUARIO_NO_ENCONTRADO: 
                        Swal.fire({
                            icon: 'error',
                            title: 'Usuario no encontrado',
                            text: response.data.mensajeResultado || 'El correo electrónico no está registrado en nuestro sistema',
                            confirmButtonColor: '#7c3aed',
                            background: '#fff'
                        });
                        break;
                        
                    case LOGIN_CUENTA_INACTIVA: 
                        Swal.fire({
                            icon: 'warning',
                            title: 'Cuenta inactiva',
                            text: response.data.mensajeResultado || 'Tu cuenta se encuentra inactiva. Contacta a soporte para más información',
                            confirmButtonColor: '#7c3aed',
                            background: '#fff'
                        });
                        break;
                        
                    case LOGIN_CUENTA_BLOQUEADA: 
                        Swal.fire({
                            icon: 'error',
                            title: 'Cuenta bloqueada',
                            html: `
                                <div class="text-center">
                                    <p class="mb-4">${response.data.mensajeResultado || 'Tu cuenta ha sido bloqueada por seguridad después de múltiples intentos fallidos.'}</p>
                                    <p>Debes esperar 30 minutos o usar la opción de recuperar acceso.</p>
                                </div>
                            `,
                            footer: '<a href="/recuperar-cuenta" class="text-indigo-600 hover:text-indigo-800">¿Necesitas recuperar acceso a tu cuenta?</a>',
                            confirmButtonColor: '#7c3aed',
                            background: '#fff',
                            customClass: {
                                container: 'my-swal'
                            }
                        });
                        break;
                        
                    case LOGIN_CONTRASENA_INCORRECTA: 
                        // Incrementar contador de intentos fallidos
                        const nuevosIntentos = intentosFallidos + 1;
                        setIntentosFallidos(nuevosIntentos);
                        
                        // Intentar obtener intentos restantes desde el mensaje del servidor
                        let intentosRestantes = 0;
                        const match = response.data.mensajeResultado ? 
                                     response.data.mensajeResultado.match(/Intentos restantes: (\d+)/) : null;
                                     
                        if (match && match[1]) {
                            intentosRestantes = parseInt(match[1]);
                        } else {
                            // Si no hay información en el mensaje, calculamos nosotros
                            intentosRestantes = Math.max(0, 3 - nuevosIntentos);
                        }
                        
                        if (intentosRestantes > 0) {
                            const progreso = ((3-intentosRestantes)/3)*100;
                            
                            Swal.fire({
                                icon: 'warning',
                                title: 'Contraseña incorrecta',
                                html: `
                                    <div class="flex flex-col items-center">
                                        <p class="mb-3 text-md">Contraseña no válida</p>
                                        <div class="w-full bg-gray-200 rounded-full h-4 mb-2 dark:bg-gray-700 overflow-hidden">
                                            <div class="h-4 rounded-full transition-all duration-700 animate-pulse" 
                                                style="width: ${progreso}%; background-image: linear-gradient(to right, #ef4444, #b91c1c);"></div>
                                        </div>
                                        <p class="text-red-500 font-bold text-md">Te quedan ${intentosRestantes} ${intentosRestantes === 1 ? 'intento' : 'intentos'} antes de que tu cuenta sea bloqueada</p>
                                    </div>
                                `,
                                confirmButtonColor: '#7c3aed',
                                background: '#fff',
                                showClass: {
                                    popup: 'animate__animated animate__fadeInDown'
                                },
                                hideClass: {
                                    popup: 'animate__animated animate__fadeOutUp'
                                }
                            });
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: '¡Último intento!',
                                text: 'Contraseña incorrecta. Tu cuenta será bloqueada después de este intento.',
                                confirmButtonColor: '#7c3aed',
                                background: '#fff',
                                showClass: {
                                    popup: 'animate__animated animate__shakeX'
                                }
                            });
                        }
                        break;
                        
                    case LOGIN_ERROR_INESPERADO:
                        Swal.fire({
                            icon: 'error',
                            title: 'Error del sistema',
                            text: response.data.mensajeResultado || "Error inesperado al iniciar sesión",
                            confirmButtonColor: '#7c3aed',
                            background: '#fff'
                        });
                        break;
                        
                    default:
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: response.data.mensajeResultado || "Error desconocido al iniciar sesión",
                            confirmButtonColor: '#7c3aed',
                            background: '#fff'
                        });
                }
            }
        } catch (error) {
            console.error("Error en login:", error);
            
            if (IS_DEV_MODE && error.response) {
                setDebugInfo({
                    error: true,
                    status: error.response.status,
                    data: error.response.data
                });
            }
            
            // Si hay error con código y datos específicos, procesarlo
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                
                // Procesar códigos de resultado específicos
                if (errorData.codigoResultado === LOGIN_CONTRASENA_INCORRECTA) {
                    const nuevosIntentos = intentosFallidos + 1;
                    setIntentosFallidos(nuevosIntentos);
                    mostrarAlertaIntentos();
                } else if (errorData.codigoResultado === LOGIN_CUENTA_BLOQUEADA) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Cuenta bloqueada',
                        html: `
                            <div class="text-center">
                                <p class="mb-4">${errorData.mensajeResultado || 'Tu cuenta ha sido bloqueada por seguridad después de múltiples intentos fallidos.'}</p>
                                <p>Debes esperar 30 minutos o usar la opción de recuperar acceso.</p>
                            </div>
                        `,
                        footer: '<a href="/recuperar-cuenta" class="text-indigo-600 hover:text-indigo-800">¿Necesitas recuperar acceso a tu cuenta?</a>',
                        confirmButtonColor: '#7c3aed',
                        background: '#fff'
                    });
                } else {
                    // Error genérico pero con mensaje del servidor
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de autenticación',
                        text: errorData.mensajeResultado || 'Ocurrió un error al intentar iniciar sesión',
                        confirmButtonColor: '#7c3aed',
                        background: '#fff'
                    });
                }
            } else {
                // Error genérico de conexión o red
                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: 'No se pudo conectar al servidor. Verifica tu conexión a internet.',
                    confirmButtonColor: '#7c3aed',
                    background: '#fff'
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleRecuperarCuenta = (e) => {
        e.preventDefault();
        navigate("/recuperar-cuenta");
    };

    // Función para activar o desactivar el modo de depuración (solo en desarrollo)
    const toggleDebug = () => {
        if (IS_DEV_MODE) {
            setShowDebug(!showDebug);
        }
    };

    // Función para alternar la visualización de la contraseña
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
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
                
                {/* Círculos decorativos con animación */}
                <motion.div 
                    animate={{ 
                        scale: [1, 1.05, 1],
                        opacity: [0.5, 0.6, 0.5]
                    }}
                    transition={{ 
                        repeat: Infinity, 
                        duration: 5,
                        ease: "easeInOut"
                    }}
                    className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-indigo-100 opacity-50"
                />
                <motion.div 
                    animate={{ 
                        scale: [1, 1.05, 1],
                        opacity: [0.5, 0.6, 0.5]
                    }}
                    transition={{ 
                        repeat: Infinity, 
                        duration: 6,
                        ease: "easeInOut",
                        delay: 0.5
                    }}
                    className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-purple-100 opacity-50"
                />
                
                {/* Flecha para regresar al home con animación */}
                <motion.button
                    whileHover={{ scale: 1.1, x: -3 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/")}
                    className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none z-10"
                    aria-label="Regresar al inicio"
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

                {/* Logo con animación */}
                <motion.div 
                    className="flex justify-center mb-6"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                    <motion.div 
                        className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center"
                        whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(124, 58, 237, 0.4)" }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </motion.div>
                </motion.div>

                <motion.h1 
                    className="text-3xl font-bold text-center mb-8 text-indigo-800 relative z-10"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                >
                    Iniciar Sesión
                </motion.h1>

                <form onSubmit={handleLogin} className="space-y-6 relative z-10">
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
                            Contraseña
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="contrasena"
                                name="contrasena"
                                required
                                className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 transition-all"
                                placeholder="Tu contraseña"
                            />
                            <div 
                                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" 
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7A9.97 9.97 0 014.02 8.971m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Animación para errores del formulario */}
                    <AnimatePresence>
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
                    </AnimatePresence>

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
                        ) : "Ingresar"}
                    </motion.button>
                </form>

                <motion.div 
                    className="mt-6 text-center space-y-2 relative z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    <motion.a
                        whileHover={{ scale: 1.05, x: 3 }}
                        href="#"
                        className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline transition-colors block"
                    >
                        ¿Olvidaste tu contraseña?
                    </motion.a>
                    <motion.div whileHover={{ scale: 1.05, x: 3 }}>
                        <a
                            href="/recuperar-cuenta" 
                            onClick={handleRecuperarCuenta}
                            className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline transition-colors block mt-1"
                        >
                            ¿Cuenta bloqueada? Recuperar acceso
                        </a>
                    </motion.div>
                </motion.div>
                
                {/* Solo en modo desarrollo: botón secreto para activar el debug */}
                {IS_DEV_MODE && (
                    <div 
                        onClick={toggleDebug} 
                        className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-gray-200 cursor-pointer hover:bg-gray-300"
                        title="Toggle Debug Mode"
                    ></div>
                )}
                
                {/* Área de diagnóstico - SOLO visible en modo desarrollo Y cuando se activa explícitamente */}
                {IS_DEV_MODE && showDebug && debugInfo && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-6 p-4 bg-gray-100 rounded-lg text-xs text-left"
                    >
                        <div className="flex justify-between items-center">
                            <h4 className="font-bold mb-2">Diagnóstico (Solo DEV)</h4>
                            {debugInfo.codigoResultado === LOGIN_CONTRASENA_INCORRECTA && (
                                <button 
                                    onClick={mostrarAlertaIntentos}
                                    className="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700"
                                >
                                    Ver alerta
                                </button>
                            )}
                        </div>
                        <pre className="overflow-auto max-h-40">{JSON.stringify(debugInfo, null, 2)}</pre>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
} 