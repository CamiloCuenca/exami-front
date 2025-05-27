import { useState, useEffect } from 'react';
import { categoriaService } from '../services/categoriaService';
import { temaService } from '../services/temaService';
import Swal from 'sweetalert2';

export const useCategoriasTemas = () => {
    const [categorias, setCategorias] = useState([]);
    const [temas, setTemas] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const cargarCategorias = async () => {
        setIsLoading(true);
        try {
            const response = await categoriaService.obtenerCategorias();
            if (response.success) {
                setCategorias(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            setError(error.message);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar las categorías',
                confirmButtonColor: '#7c3aed'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const cargarTemas = async () => {
        setIsLoading(true);
        try {
            const response = await temaService.obtenerTemas();
            if (response.success) {
                setTemas(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            setError(error.message);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar los temas',
                confirmButtonColor: '#7c3aed'
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        cargarCategorias();
        cargarTemas();
    }, []);

    return {
        categorias,
        temas,
        isLoading,
        error,
        cargarCategorias,
        cargarTemas
    };
}; 