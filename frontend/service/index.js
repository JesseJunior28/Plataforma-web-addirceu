import api, { formatErrorMessage } from './api';
import participanteService from './participanteService';
import congregacaoService from './congregacaoService';
import eventoService from './eventoService';

// Utilitário para exibir erros para o usuário
export const handleApiError = (error, setErrorMessage) => {
  const message = error.message || formatErrorMessage(error);
  if (setErrorMessage) {
    setErrorMessage(message);
  } else {
    alert(message);
  }
  console.error('API Error:', error);
};

// Exportando todos os serviços de forma centralizada
export {
  api,
  formatErrorMessage,
  participanteService,
  congregacaoService,
  eventoService
};

// Exporta objeto com todos os serviços
const services = {
  api,
  participante: participanteService,
  congregacao: congregacaoService,
  evento: eventoService,
  errorHandler: handleApiError
};

export default services;
