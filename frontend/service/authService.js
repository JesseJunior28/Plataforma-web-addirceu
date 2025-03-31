import api, { formatErrorMessage } from './api';

const authService = {
  login: async (email, senha) => {
    try {
      const response = await api.post('/auth/login/', { 
        email: email.trim(), 
        senha: senha.trim() 
      });

      if (response.data.usuario) {
        localStorage.setItem('user', JSON.stringify(response.data.usuario));
        
        // Adicionar o token se a API retornar (opcional)
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
      }
      
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Email ou senha incorretos');
      }
      throw {
        message: formatErrorMessage(error),
        original: error
      };
    }
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/login';
  },

  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Erro ao recuperar usuário:', error);
      return null;
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('user');
  }
};

export default authService;
