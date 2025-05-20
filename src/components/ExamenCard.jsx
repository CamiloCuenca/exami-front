import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const statusStyles = {
    "Finalizado": "bg-red-100 text-red-800",
    "Disponible": "bg-green-100 text-green-800",
    "Pendiente": "bg-yellow-100 text-yellow-800",
    "Borrador": "bg-gray-100 text-gray-800"
};

const ExamenCard = ({ examen }) => {
    // Asegurarse de que examen y sus propiedades existan antes de acceder a ellas
    if (!examen) {
        return null; // O puedes retornar un placeholder vacío
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
                     {examen.nombreTopico && (
                         <p className="flex items-center"><strong className="mr-1">Tópico:</strong> {examen.nombreTopico}</p>
                     )}
                     {examen.nombreCurso && (
                         <p className="flex items-center"><strong className="mr-1">Curso:</strong> {examen.nombreCurso}</p>
                     )}
                    {examen.fechaInicio && (
                        <p className="flex items-center"><strong className="mr-1">Inicio:</strong> {new Date(examen.fechaInicio).toLocaleDateString()} {new Date(examen.fechaInicio).toLocaleTimeString()}</p>
                    )}
                    {examen.fechaFin && (
                        <p className="flex items-center"><strong className="mr-1">Fin:</strong> {new Date(examen.fechaFin).toLocaleDateString()} {new Date(examen.fechaFin).toLocaleTimeString()}</p>
                    )}
                    {/* Añadir otros detalles importantes si están disponibles en DTO */}
                </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-4">
                {/* Botones de acción */}
                {examen.estado === "Disponible" && (
                    <Link 
                        to={`/examen/${examen.idExamen}`}
                        className="text-sm font-medium text-green-600 hover:text-green-800 transition-colors"
                    >
                        Comenzar
                    </Link>
                )}
                 {examen.estado !== "Finalizado" && examen.estado !== "Disponible" && ( // Mostrar editar/eliminar si no ha finalizado o está disponible
                    <>
                        <Link 
                            to={`/editar-examen/${examen.idExamen}`}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                            Editar
                        </Link>
                        <button 
                            onClick={() => alert(`Eliminar examen ${examen.idExamen}`)} // Placeholder: Implementar SweetAlert para confirmar
                            className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
                        >
                            Eliminar
                        </button>
                    </>
                 )}
                {examen.estado === "Finalizado" && ( // Mostrar ver resultados si ha finalizado
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