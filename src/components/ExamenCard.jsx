import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Users, FileText, Award, RefreshCw, Eye, MessageSquare } from 'react-feather';

const statusStyles = {
    "Finalizado": "bg-red-100 text-red-800",
    "Disponible": "bg-green-100 text-green-800",
    "Pendiente": "bg-yellow-100 text-yellow-800",
    "Borrador": "bg-gray-100 text-gray-800"
};

const ExamenCard = ({ examen, onView, onDelete }) => {
    if (!examen) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.03, boxShadow: "0px 5px 15px rgba(0,0,0,0.1)" }}
            className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full font-sans"
        >
            <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-xl text-indigo-800 leading-tight mr-4 font-heading">
                        {examen.nombre}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[examen.estado] || 'bg-gray-200 text-gray-800'}`}>
                        {examen.estado}
                    </span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {examen.descripcion}
                </p>
                
                <div className="text-sm text-gray-700 space-y-2">
                    {examen.nombreTema && (
                        <p className="flex items-center">
                            <FileText size={16} className="mr-2 text-indigo-600" />
                            <span><strong className="mr-1">Tema:</strong> {examen.nombreTema}</span>
                        </p>
                    )}
                    {examen.nombreCurso && (
                        <p className="flex items-center">
                            <Award size={16} className="mr-2 text-indigo-600" />
                            <span><strong className="mr-1">Curso:</strong> {examen.nombreCurso}</span>
                        </p>
                    )}
                    {examen.fechaInicioFormateada && (
                        <p className="flex items-center">
                            <Clock size={16} className="mr-2 text-indigo-600" />
                            <span><strong className="mr-1">Inicio:</strong> {examen.fechaInicioFormateada}</span>
                        </p>
                    )}
                    {examen.fechaFinFormateada && (
                        <p className="flex items-center">
                            <Clock size={16} className="mr-2 text-indigo-600" />
                            <span><strong className="mr-1">Fin:</strong> {examen.fechaFinFormateada}</span>
                        </p>
                    )}
                    <div className="grid grid-cols-2 gap-2 mt-4">
                        <div className="flex items-center">
                            <FileText size={16} className="mr-2 text-indigo-600" />
                            <span className="text-xs">
                                <strong>Preguntas:</strong> {examen.cantidadPreguntasPresentar}/{examen.cantidadPreguntasTotal}
                            </span>
                        </div>
                        <div className="flex items-center">
                            <Clock size={16} className="mr-2 text-indigo-600" />
                            <span className="text-xs">
                                <strong>Tiempo:</strong> {examen.tiempoLimite} min
                            </span>
                        </div>
                        <div className="flex items-center">
                            <Award size={16} className="mr-2 text-indigo-600" />
                            <span className="text-xs">
                                <strong>Peso:</strong> {examen.pesoCurso}%
                            </span>
                        </div>
                        <div className="flex items-center">
                            <RefreshCw size={16} className="mr-2 text-indigo-600" />
                            <span className="text-xs">
                                <strong>Intentos:</strong> {examen.intentosPermitidos}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center mt-2">
                        {examen.mostrarResultados === 1 && (
                            <span className="flex items-center mr-4">
                                <Eye size={16} className="mr-1 text-green-600" />
                                <span className="text-xs text-green-600">Ver resultados</span>
                            </span>
                        )}
                        {examen.permitirRetroalimentacion === 1 && (
                            <span className="flex items-center">
                                <MessageSquare size={16} className="mr-1 text-blue-600" />
                                <span className="text-xs text-blue-600">Retroalimentación</span>
                            </span>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-4">
                <Link 
                    to={`/examen/${examen.idExamen}`}
                    className="text-sm font-medium text-green-600 hover:text-green-800 transition-colors"
                >
                    Ver Detalles
                </Link>
                <button 
                    onClick={onDelete}
                    className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
                >
                    Eliminar
                </button>
                {examen.estado !== "Finalizado" && examen.estado !== "Disponible" && (
                    <Link 
                        to={`/editar-examen/${examen.idExamen}`}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                        Editar
                    </Link>
                )}
                {examen.estado === "Finalizado" && (
                    <Link 
                        to={`/resultados-examen/${examen.idExamen}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        Ver Resultados
                    </Link>
                )}
            </div>
        </motion.div>
    );
};

export default ExamenCard; 