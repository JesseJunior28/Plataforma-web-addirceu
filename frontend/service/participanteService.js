import api, { formatErrorMessage } from './api';

const participanteService = {
  cadastrarParticipante: async (participanteData) => {
    try {
      // Garantir que valor_pago seja um número para o backend
      const data = { ...participanteData };
      if (typeof data.valor_pago === 'string') {
        data.valor_pago = parseFloat(data.valor_pago.replace(/\./g, '').replace(',', '.')) || 0;
      }

      const response = await api.post('/participante/cadastro/', data);
      return response.data;
    } catch (error) {
      throw {
        message: formatErrorMessage(error),
        original: error
      };
    }
  },

  listarInscricoes: async (page = 1, pageSize = 10, filters = {}) => {
    try {
      const response = await api.get('/inscricoes/');
      console.log('Resposta API inscrições:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar inscrições:', error);
      throw {
        message: formatErrorMessage(error),
        original: error
      };
    }
  },

  getInscricao: async (inscricaoId) => {
    try {
      const response = await api.get(`/inscricao/${inscricaoId}/`);
      return response.data;
    } catch (error) {
      throw {
        message: formatErrorMessage(error),
        original: error
      };
    }
  },

  editarInscricao: async (inscricaoId, inscricaoData) => {
    try {
      // Garantir que o valor_pago seja um número para o backend
      const data = { ...inscricaoData };
      if (typeof data.valor_pago === 'string') {
        data.valor_pago = parseFloat(data.valor_pago.replace(/\./g, '').replace(',', '.')) || 0;
      }
      
      const response = await api.put(`/inscricao/editar/${inscricaoId}/`, data);
      return response.data;
    } catch (error) {
      throw {
        message: formatErrorMessage(error),
        original: error
      };
    }
  },

  deletarInscricao: async (inscricaoId) => {
    try {
      const response = await api.delete(`/inscricao/deletar/${inscricaoId}/`);
      return response.data;
    } catch (error) {
      throw {
        message: formatErrorMessage(error),
        original: error
      };
    }
  },
  
  // Função adicional para estatísticas (se implementado no backend)
  obterEstatisticas: async (eventoId) => {
    try {
      const params = eventoId ? { evento_id: eventoId } : {};
      const response = await api.get('/estatisticas/inscricoes/', { params });
      return response.data;
    } catch (error) {
      throw {
        message: formatErrorMessage(error),
        original: error
      };
    }
  },
};

export default participanteService;
