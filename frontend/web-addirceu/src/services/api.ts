import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true
});

// Função para verificar erro de rede
const isNetworkError = (error: AxiosError): boolean => {
  return !error.response && !!error.request;
};

// Função auxiliar para formatar mensagens de erro
export const formatErrorMessage = (error: AxiosError): string => {
  if (isNetworkError(error)) {
    return 'Erro de conexão. Verifique sua internet ou tente novamente mais tarde.';
  }
  
  if (error.response) {
    const { data } = error.response;
    // Usando type assertion para evitar erros de tipagem
    const errorData = data as any;
    
    if (errorData.error) {
      return errorData.error;
    } else if (errorData.message) {
      return errorData.message;
    } else if (errorData.detail) {
      return errorData.detail;
    }
  }
  
  return error.message || 'Ocorreu um erro inesperado';
};

// Interceptor para tratar erros de requisição
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    console.error('Erro ao preparar requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    if (error.response) {
      // O servidor respondeu com um status de erro
      console.error('Erro na resposta:', error.response.data);
      
      // Tratamento específico por código de status
      const status = error.response.status;
      switch (status) {
        case 400:
          console.error('Requisição inválida:', error.response.data);
          break;        case 401:
          console.error('Não autorizado');
          // Evita importação circular - logout será tratado pelos componentes
          if (typeof window !== 'undefined') {
            localStorage.clear();
            window.location.href = '/login';
          }
          break;
        case 403:
          console.error('Acesso proibido');
          break;
        case 404:
          console.error('Recurso não encontrado');
          break;
        case 500:
          console.error('Erro interno do servidor');
          break;
        default:
          console.error(`Erro ${status}`);
      }
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      console.error('Erro de conexão com o servidor. Verifique sua internet.');
    } else {
      // Algum erro ocorreu ao configurar a requisição
      console.error('Erro ao configurar requisição:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;