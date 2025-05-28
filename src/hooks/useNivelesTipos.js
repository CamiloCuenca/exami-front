import { useState, useEffect } from 'react';
import { nivelDificultadService } from '../services/nivelDificultadService';
import { tipoPreguntaService } from '../services/tipoPreguntaService';
import Swal from 'sweetalert2';

export const useNivelesTipos = () => {
    const [nivelesDificultad, setNivelesDificultad] = useState([]);
    const [tiposPregunta, setTiposPregunta] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const cargarNivelesDificultad = async () => {
        try {
            const response = await nivelDificultadService.obtenerNivelesDificultad();
            if (response.success) {
                setNivelesDificultad(response.data);
            } else {
                throw new Error(response.message || 'Error al cargar niveles de dificultad');
            }
        } catch (error) {
            setError(error.message);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar los niveles de dificultad'
            });
        }
    };

    const cargarTiposPregunta = async () => {
        try {
            const response = await tipoPreguntaService.obtenerTiposPregunta();
            if (response.success) {
                console.log('Tipos de pregunta cargados:', response.data);
                setTiposPregunta(response.data);
            } else {
                throw new Error(response.message || 'Error al cargar tipos de pregunta');
            }
        } catch (error) {
            setError(error.message);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar los tipos de pregunta'
            });
        }
    };

    useEffect(() => {
        const cargarDatos = async () => {
            setIsLoading(true);
            setError(null);
            try {
                await Promise.all([
                    cargarNivelesDificultad(),
                    cargarTiposPregunta()
                ]);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        cargarDatos();
    }, []);

    return {
        nivelesDificultad,
        tiposPregunta,
        isLoading,
        error,
        cargarNivelesDificultad,
        cargarTiposPregunta
    };
}; 