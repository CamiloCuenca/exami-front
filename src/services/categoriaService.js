import api from './api';

export const categoriaService = {
    obtenerCategorias: async () => {
        try {
            const response = await api.get('/examen/categorias');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    obtenerCategoriaPorId: async (idCategoria) => {
        try {
            const response = await api.get(`/examen/categorias/${idCategoria}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}; 