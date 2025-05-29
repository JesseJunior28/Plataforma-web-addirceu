import api, { formatErrorMessage } from './api';
import { AxiosError } from 'axios';

const congregacaoService = {
  listarCongregacoes: async () => {
    try {
      const response = await api.get('/congregacoes/');
      return response.data;
    } catch (error: any) {
      throw {
        message: formatErrorMessage(error as AxiosError),
        original: error
      };
    }
  },
};

export default congregacaoService;
