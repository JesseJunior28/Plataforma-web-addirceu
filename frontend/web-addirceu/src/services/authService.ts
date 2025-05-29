import api, { formatErrorMessage } from './api';

const authService = {
  login: async (email: string, senha: string) => {
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
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        throw new Error('Email ou senha incorretos');
      }
      throw {
        message: formatErrorMessage(error),
        original: error
      };
    }
  },
  logout: async () => {
    try {
      await api.post('/auth/logout/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }
    }
  },
  getCurrentUser: () => {
    try {
      if (typeof window !== 'undefined') {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
      }
      return null;
    } catch (error) {
      console.error('Erro ao recuperar usuário:', error);
      return null;
    }
  },

  isAuthenticated: () => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('user');
    }
    return false;
  }
};

export default authService;