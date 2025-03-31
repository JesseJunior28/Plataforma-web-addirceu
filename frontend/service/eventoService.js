import api, { formatErrorMessage } from './api';

const eventoService = {
  listarEventos: async (incluirPassados = false) => {
    try {
      const params = incluirPassados ? { todos: true } : {};
      const response = await api.get('/eventos/', { params });
      return response.data;
    } catch (error) {
      throw {
        message: formatErrorMessage(error),
        original: error
      };
    }
  },
  
  buscarEvento: async (id) => {
    try {
      const response = await api.get(`/evento/${id}/`);
      return response.data;
    } catch (error) {
      throw {
        message: formatErrorMessage(error),
        original: error
      };
    }
  },
  
  cadastrarEvento: async (eventoData) => {
    try {
      const response = await api.post('/evento/cadastro/', eventoData);
      return response.data;
    } catch (error) {
      throw {
        message: formatErrorMessage(error),
        original: error
      };
    }
  },
  
  editarEvento: async (eventoId, eventoData) => {
    try {
      const response = await api.put(`/evento/editar/${eventoId}/`, eventoData);
      return response.data;
    } catch (error) {
      throw {
        message: formatErrorMessage(error),
        original: error
      };
    }
  },
  
  deletarEvento: async (eventoId) => {
    try {
      const response = await api.delete(`/evento/deletar/${eventoId}/`);
      return response.data;
    } catch (error) {
      throw {
        message: formatErrorMessage(error),
        original: error
      };
    }
  }
};

export default eventoService;
