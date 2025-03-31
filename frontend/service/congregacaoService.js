import api, { formatErrorMessage } from './api';

const congregacaoService = {
  listarCongregacoes: async () => {
    try {
      const response = await api.get('/congregacoes/');
      return response.data;
    } catch (error) {
      throw {
        message: formatErrorMessage(error),
        original: error
      };
    }
  },
};

export default congregacaoService;
