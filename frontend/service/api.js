import axios from 'axios';

// Atualizando o URL base para apontar especificamente para a API Django
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

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
const isNetworkError = (error) => {
  return !error.response && error.request;
};

// Função auxiliar para formatar mensagens de erro
export const formatErrorMessage = (error) => {
  if (isNetworkError(error)) {
    return 'Erro de conexão. Verifique sua internet ou tente novamente mais tarde.';
  }
  
  if (error.response) {
    const { data } = error.response;
    if (data.error) {
      return data.error;
    } else if (data.message) {
      return data.message;
    } else if (data.detail) {
      return data.detail;
    }
  }
  
  return error.message || 'Ocorreu um erro inesperado';
};

// Interceptor para tratar erros de requisição
api.interceptors.request.use(
  config => {
    // Aqui você pode adicionar token de autenticação quando implementar
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  error => {
    console.error('Erro ao preparar requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // O servidor respondeu com um status de erro
      console.error('Erro na resposta:', error.response.data);
      
      // Tratamento específico por código de status
      switch (error.response.status) {
        case 400:
          console.error('Requisição inválida:', error.response.data);
          break;
        case 401:
          console.error('Não autorizado');
          // Aqui você pode implementar redirecionamento para login
          // window.location = '/login';
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
          console.error(`Erro ${error.response.status}`);
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
