import api from "../services/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
    const navigate = useNavigate();
    const [intentosFallidos, setIntentosFallidos] = useState(0);
    const [debugInfo, setDebugInfo] = useState(null);

    const handleLogin = async (event) => {
        event.preventDefault();
        const form = event.target;
        const email = form.email.value;
        const contrasena = form.contrasena.value;

        try {
            const response = await api.post("/auth/login", { email, contrasena });
            
            // Guardar información de diagnóstico
            setDebugInfo({
                codigoResultado: response.data.codigoResultado,
                mensajeResultado: response.data.mensajeResultado,
                datoExtra: response.data.datoExtra || null
            });
            
            console.log("Respuesta del servidor:", response.data);

            if (response.data.codigoResultado === 1) {
                // Resetear intentos fallidos al lograr un login exitoso
                setIntentosFallidos(0);
                Swal.fire("Éxito", "Bienvenido!", "success");
                // Guardar la respuesta en localStorage
                localStorage.setItem("user", JSON.stringify(response.data));
                // Redirigir según el tipo de usuario
                if (response.data.tipoUsuario === "Estudiante") {
                    navigate("/");
                } else {
                    navigate("/homeProfe");
                }
            } else {
                let errorMessage = "Error desconocido";
                let intentosRestantes = 0;
                
                switch(response.data.codigoResultado) {
                    case -1: 
                        errorMessage = "Usuario no encontrado"; 
                        break;
                    case -2: 
                        errorMessage = "Cuenta inactiva"; 
                        break;
                    case -3: 
                        // Mostrar mensaje especial para cuentas bloqueadas
                        Swal.fire({
                            icon: 'error',
                            title: 'Cuenta bloqueada',
                            text: 'Tu cuenta ha sido bloqueada por seguridad después de múltiples intentos fallidos.',
                            footer: '<a href="/recuperar-cuenta">¿Necesitas recuperar acceso a tu cuenta?</a>'
                        });
                        return;
                    case -4: 
                        // Incrementar contador de intentos fallidos
                        const nuevosIntentos = intentosFallidos + 1;
                        setIntentosFallidos(nuevosIntentos);
                        
                        // Calcular intentos restantes (asumiendo máximo 3 intentos)
                        intentosRestantes = Math.max(0, 3 - nuevosIntentos);
                        
                        // Mensaje personalizado según los intentos restantes
                        if (intentosRestantes > 0) {
                            errorMessage = `Contraseña incorrecta. Te quedan ${intentosRestantes} ${intentosRestantes === 1 ? 'intento' : 'intentos'} antes de que tu cuenta sea bloqueada.`;
                        } else {
                            errorMessage = "Contraseña incorrecta. Tu cuenta será bloqueada después de este intento.";
                        }
                        break;
                    case -99:
                        errorMessage = "Error de base de datos: " + response.data.mensajeResultado;
                        break;
                }
                Swal.fire("Error", errorMessage, "error");
            }
        } catch (error) {
            console.error("Error en login:", error);
            if (error.response) {
                setDebugInfo({
                    error: true,
                    status: error.response.status,
                    data: error.response.data
                });
                Swal.fire("Error", "Problema con el servidor", "error");
            } else {
                Swal.fire("Error", "No se pudo conectar al servidor", "error");
            }
        }
    };

    const handleRecuperarCuenta = (e) => {
        e.preventDefault();
        navigate("/recuperar-cuenta");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-gray-light)]">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 pt-12 relative">
                {/* Flecha para regresar al home */}
                <button
                    onClick={() => navigate("/")}
                    className="absolute top-4 left-4 p-1 rounded-full bg-[var(--color-gray-light)] hover:bg-[var(--color-primary)] transition-colors focus:outline-none"
                    aria-label="Regresar al inicio"
                    
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 md:h-3 md:w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        style={{ color: "var(--color-secondary)" }}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-3xl font-bold text-center mb-8 text-[var(--color-secondary)] mt-2">
                    Iniciar Sesión
                </h1>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-semibold text-[var(--color-secondary)] mb-1"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            className="w-full px-4 py-2 border border-[var(--color-gray-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-[var(--color-gray-light)]"
                            placeholder="ejemplo@correo.com"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="contrasena"
                            className="block text-sm font-semibold text-[var(--color-secondary)] mb-1"
                        >
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="contrasena"
                            name="contrasena"
                            required
                            className="w-full px-4 py-2 border border-[var(--color-gray-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-[var(--color-gray-light)]"
                            placeholder="Tu contraseña"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 rounded-lg font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-accent)] transition-colors"
                    >
                        Ingresar
                    </button>
                </form>
                <div className="mt-6 text-center space-y-2">
                    <a
                        href="#"
                        className="text-sm text-[var(--color-accent)] hover:underline"
                    >
                        ¿Olvidaste tu contraseña?
                    </a>
                    <div>
                        <a
                            href="/recuperar-cuenta" 
                            onClick={handleRecuperarCuenta}
                            className="text-sm text-[var(--color-accent)] hover:underline block mt-1"
                        >
                            ¿Cuenta bloqueada? Recuperar acceso
                        </a>
                    </div>
                </div>
                
                {/* Área de diagnóstico (solo visible en modo de desarrollo) */}
                {debugInfo && process.env.NODE_ENV === 'development' && (
                    <div className="mt-6 p-4 bg-gray-100 rounded-lg text-xs text-left">
                        <h4 className="font-bold mb-2">Diagnóstico</h4>
                        <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
                    </div>
                )}
            </div>
        </div>
    );
} 