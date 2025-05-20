import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import api from "../services/api";
import {
    COD_EXITO,
    COD_EMAIL_YA_EXISTE,
    COD_ERROR_PARAMETROS,
    COD_ERROR_REGISTRO,
    COD_TIPO_USUARIO_INVALIDO,
    COD_ESTADO_INVALIDO,
    TIPO_ESTUDIANTE,
    ESTADO_ACTIVO
} from "../constants/auth";

export default function Registro() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        email: "",
        contrasena: "",
        confirmContrasena: "",
        telefono: "",
        direccion: ""
    });
    const [showPassword, setShowPassword] = useState(false);

    // Manejar cambios en los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Limpia errores de validación al editar
        if (validationErrors[name]) {
            setValidationErrors({
                ...validationErrors,
                [name]: ""
            });
        }
    };

    // Validar el formulario
    const validateForm = () => {
        const errors = {};

        // Validación de campos requeridos
        if (!formData.nombre) errors.nombre = "El nombre es obligatorio";
        if (!formData.apellido) errors.apellido = "El apellido es obligatorio";
        if (!formData.email) errors.email = "El email es obligatorio";
        if (!formData.contrasena) errors.contrasena = "La contraseña es obligatoria";

        // Validar formato de email
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = "Formato de email inválido";
        }

        // Validar que las contraseñas coincidan
        if (formData.contrasena !== formData.confirmContrasena) {
            errors.confirmContrasena = "Las contraseñas no coinciden";
        }

        // Validar complejidad de la contraseña (al menos 8 caracteres con letras y números)
        if (formData.contrasena && formData.contrasena.length < 8) {
            errors.contrasena = "La contraseña debe tener al menos 8 caracteres";
        } else if (formData.contrasena && !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/.test(formData.contrasena)) {
            errors.contrasena = "La contraseña debe contener letras y números";
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Manejar envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar formulario
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Preparar datos para enviar al backend siguiendo la estructura esperada del RegistroRequestDTO
            const registroData = {
                nombre: formData.nombre,
                apellido: formData.apellido,
                email: formData.email,
                contrasena: formData.contrasena,
                idTipoUsuario: TIPO_ESTUDIANTE, // Por defecto registramos como estudiante
                idEstado: ESTADO_ACTIVO, // Por defecto el estado es activo
                telefono: formData.telefono || null,
                direccion: formData.direccion || null
            };

            const response = await api.post("/auth/registro", registroData);

            // Procesar respuesta según los códigos definidos en el backend
            switch (response.data.codigoResultado) {
                case COD_EXITO:
                    // Registro exitoso
                    Swal.fire({
                        icon: "success",
                        title: "¡Registro exitoso!",
                        text: "Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.",
                        confirmButtonColor: "#6366f1",
                        background: "#fff"
                    }).then((result) => {
                        if (result.isConfirmed || result.isDismissed) {
                            navigate("/login");
                        }
                    });
                    break;

                case COD_EMAIL_YA_EXISTE:
                    Swal.fire({
                        icon: "warning",
                        title: "Email en uso",
                        text: "El correo electrónico ya está registrado. Por favor, utiliza otro o inicia sesión.",
                        confirmButtonColor: "#6366f1",
                        background: "#fff"
                    });
                    break;

                case COD_ERROR_PARAMETROS:
                    Swal.fire({
                        icon: "error",
                        title: "Datos incompletos",
                        text: response.data.mensajeResultado || "Por favor, completa todos los campos obligatorios.",
                        confirmButtonColor: "#6366f1",
                        background: "#fff"
                    });
                    break;

                case COD_TIPO_USUARIO_INVALIDO:
                case COD_ESTADO_INVALIDO:
                    Swal.fire({
                        icon: "error",
                        title: "Error de configuración",
                        text: response.data.mensajeResultado || "Error en la configuración de tipo de usuario o estado.",
                        confirmButtonColor: "#6366f1",
                        background: "#fff"
                    });
                    break;

                case COD_ERROR_REGISTRO:
                default:
                    Swal.fire({
                        icon: "error",
                        title: "Error en el registro",
                        text: response.data.mensajeResultado || "Ha ocurrido un error al registrar tu cuenta. Por favor, intenta nuevamente más tarde.",
                        confirmButtonColor: "#6366f1",
                        background: "#fff"
                    });
            }
        } catch (error) {
            console.error("Error en registro:", error);
            
            Swal.fire({
                icon: "error",
                title: "Error de conexión",
                text: "No se pudo conectar con el servidor. Por favor, verifica tu conexión e intenta nuevamente.",
                confirmButtonColor: "#6366f1",
                background: "#fff"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 pt-12 relative overflow-hidden my-8"
            >
                {/* Elemento decorativo */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-500"></div>
                
                {/* Círculos decorativos */}
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-indigo-100 opacity-50"></div>
                <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-purple-100 opacity-50"></div>
                
                {/* Flecha para regresar al home */}
                <button
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
                        style={{ color: "#6366f1" }}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Título */}
                <h1 className="text-3xl font-bold text-center mb-8 text-indigo-800 relative z-10 font-heading">
                    Crear Cuenta
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4 relative z-10 font-sans">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Nombre */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.4 }}
                        >
                            <label
                                htmlFor="nombre"
                                className="block text-sm font-semibold text-indigo-800 mb-1"
                            >
                                Nombre
                            </label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                required
                                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 transition-all duration-200 text-gray-800 placeholder-gray-400"
                                placeholder="Tu nombre"
                            />
                        </motion.div>
                        
                        {/* Apellido */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.5 }}
                        >
                            <label
                                htmlFor="apellido"
                                className="block text-sm font-semibold text-indigo-800 mb-1"
                            >
                                Apellido
                            </label>
                            <input
                                type="text"
                                id="apellido"
                                name="apellido"
                                required
                                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 transition-all duration-200 text-gray-800 placeholder-gray-400"
                                placeholder="Tu apellido"
                            />
                        </motion.div>
                    </div>
                    
                    {/* Email */}
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.6 }}
                    >
                        <label
                            htmlFor="email"
                            className="block text-sm font-semibold text-indigo-800 mb-1"
                        >
                            Email
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 transition-all duration-200 text-gray-800 placeholder-gray-400"
                                placeholder="ejemplo@correo.com"
                            />
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Contraseña */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.7 }}
                        >
                            <label
                                htmlFor="contrasena"
                                className="block text-sm font-semibold text-indigo-800 mb-1"
                            >
                                Contraseña
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="contrasena"
                                    name="contrasena"
                                    required
                                    className="w-full pr-10 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 transition-all duration-200 text-gray-800 placeholder-gray-400"
                                    placeholder="Crea tu contraseña"
                                />
                                <div 
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                    onClick={togglePasswordVisibility}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12a3 3 0 100-6 3 3 0 000 6z" />
                                    </svg>
                                </div>
                            </div>
                        </motion.div>
                        
                        {/* Confirmar Contraseña */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.8 }}
                        >
                            <label
                                htmlFor="confirmContrasena"
                                className="block text-sm font-semibold text-indigo-800 mb-1"
                            >
                                Confirmar Contraseña
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    id="confirmContrasena"
                                    name="confirmContrasena"
                                    required
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 transition-all duration-200 text-gray-800 placeholder-gray-400"
                                    placeholder="Repite tu contraseña"
                                />
                            </div>
                        </motion.div>
                    </div>

                    {/* Campos opcionales */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Teléfono (opcional) */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.9 }}
                        >
                            <label
                                htmlFor="telefono"
                                className="block text-sm font-semibold text-indigo-800 mb-1"
                            >
                                Teléfono (opcional)
                            </label>
                            <input
                                type="tel"
                                id="telefono"
                                name="telefono"
                                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 transition-all duration-200 text-gray-800 placeholder-gray-400"
                                placeholder="Teléfono de contacto"
                            />
                        </motion.div>
                        
                        {/* Dirección (opcional) */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.4, delay: 1.0 }}
                        >
                            <label
                                htmlFor="direccion"
                                className="block text-sm font-semibold text-indigo-800 mb-1"
                            >
                                Dirección (opcional)
                            </label>
                            <input
                                type="text"
                                id="direccion"
                                name="direccion"
                                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 transition-all duration-200 text-gray-800 placeholder-gray-400"
                                placeholder="Tu dirección"
                            />
                        </motion.div>
                    </div>

                    {/* Botón de registro */}
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 mt-4 rounded-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Procesando...
                            </span>
                        ) : "Crear cuenta"}
                    </motion.button>
                </form>

                <div className="mt-6 text-center space-y-2 relative z-10">
                    <p className="text-sm text-gray-600">
                        ¿Ya tienes una cuenta?{" "}
                        <a
                            href="/login"
                            onClick={(e) => {
                                e.preventDefault();
                                navigate("/login");
                            }}
                            className="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
                        >
                            Iniciar sesión
                        </a>
                    </p>
                </div>
            </motion.div>
        </div>
    );
} 