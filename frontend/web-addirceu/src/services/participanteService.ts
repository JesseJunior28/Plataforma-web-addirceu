import api, { formatErrorMessage } from './api';
import { AxiosError } from 'axios';

interface ParticipanteData {
  nome_completo: string;
  apelido?: string;
  cpf?: string;
  whatsapp: string;
  congregacao: string;
  tipo_no_evento: string;
  tipo_evento?: string;
  cor_camisa: string;
  estilo_camisa: string;
  tamanho: string;
  forma_pagamento?: string;
  valor_pago?: number | string;
  pagamento_feito?: boolean;
  camisa_entregue?: boolean;
  observacao?: string;
}

interface InscricaoData {
  forma_pagamento?: string;
  valor_pago?: number | string;
  pagamento_feito?: boolean;
  camisa_entregue?: boolean;
  observacao?: string;
}

const participanteService = {  cadastrarParticipante: async (participanteData: ParticipanteData) => {
    try {
      // Garantir que valor_pago seja um número para o backend
      const data: any = { ...participanteData };
      if (data.valor_pago && typeof data.valor_pago === 'string') {
        data.valor_pago = parseFloat(data.valor_pago.replace(/\./g, '').replace(',', '.')) || 0;
      }

      const response = await api.post('/participante/cadastro/', data);
      return response.data;
    } catch (error: any) {
      throw {
        message: formatErrorMessage(error as AxiosError),
        original: error
      };
    }
  },

  listarInscricoes: async (page = 1, pageSize = 10, filters = {}) => {
    try {
      const response = await api.get('/inscricoes/');
      console.log('Resposta API inscrições:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao listar inscrições:', error);
      throw {
        message: formatErrorMessage(error as AxiosError),
        original: error
      };
    }
  },

  getInscricao: async (inscricaoId: number) => {
    try {
      const response = await api.get(`/inscricao/${inscricaoId}/`);
      return response.data;
    } catch (error: any) {
      throw {
        message: formatErrorMessage(error as AxiosError),
        original: error
      };
    }
  },
  editarInscricao: async (inscricaoId: number, inscricaoData: InscricaoData) => {
    try {
      // Garantir que o valor_pago seja um número para o backend
      const data: any = { ...inscricaoData };
      if (data.valor_pago && typeof data.valor_pago === 'string') {
        data.valor_pago = parseFloat(data.valor_pago.replace(/\./g, '').replace(',', '.')) || 0;
      }
      
      const response = await api.put(`/inscricao/editar/${inscricaoId}/`, data);
      return response.data;
    } catch (error: any) {
      throw {
        message: formatErrorMessage(error as AxiosError),
        original: error
      };
    }
  },

  deletarInscricao: async (inscricaoId: number) => {
    try {
      const response = await api.delete(`/inscricao/deletar/${inscricaoId}/`);
      return response.data;
    } catch (error: any) {
      throw {
        message: formatErrorMessage(error as AxiosError),
        original: error
      };
    }
  },
  
  // Função adicional para estatísticas (se implementado no backend)
  obterEstatisticas: async (eventoId?: number) => {
    try {
      const params = eventoId ? { evento_id: eventoId } : {};
      const response = await api.get('/estatisticas/inscricoes/', { params });
      return response.data;
    } catch (error: any) {
      throw {
        message: formatErrorMessage(error as AxiosError),
        original: error
      };
    }
  },
};

export default participanteService;
