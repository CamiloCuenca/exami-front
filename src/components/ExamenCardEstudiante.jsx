import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, BookOpen, Home } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Swal from 'sweetalert2';

const ExamenCardEstudiante = ({ examen }) => {
    const navigate = useNavigate();

    const getEstadoColor = (estado) => {
        switch (estado.toLowerCase()) {
            case 'disponible':
                return 'bg-green-100 text-green-800';
            case 'en progreso':
                return 'bg-blue-100 text-blue-800';
            case 'completado':
                return 'bg-purple-100 text-purple-800';
            case 'expirado':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatFecha = (fechaString) => {
        return fechaString;
    };

    const handleComenzarExamen = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const response = await api.post(`/examen/iniciar/${examen.idExamen}/${user.idUsuario}`);
            if (response.data.success && response.data.data.idPresentacion) {
                navigate(`/presentar-examen/${response.data.data.idPresentacion}`);
            } else {
                Swal.fire('Error', 'No se pudo iniciar el examen', 'error');
            }
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'No se pudo iniciar el examen', 'error');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-indigo-800">{examen.nombre}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(examen.estado)}`}>
                        {examen.estado}
                    </span>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">{examen.descripcion}</p>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                        <Calendar size={16} className="mr-2" />
                        <span>Inicio: {formatFecha(examen.fechaInicio)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                        <Calendar size={16} className="mr-2" />
                        <span>Fin: {formatFecha(examen.fechaFin)}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                        <BookOpen size={16} className="mr-2" />
                        <span>{examen.nombreTema}</span>
                    </div>
                    <div className="flex items-center">
                        <Home size={16} className="mr-2" />
                        <span>{examen.nombreCurso}</span>
                    </div>
                </div>

                <button
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
                    onClick={handleComenzarExamen}
                >
                    Comenzar el examen
                </button>
            </div>
        </motion.div>
    );
};

export default ExamenCardEstudiante; 