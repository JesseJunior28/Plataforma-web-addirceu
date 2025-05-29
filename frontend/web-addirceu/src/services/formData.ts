import axios from 'axios';

export function createFormData(data: any) {
  if (typeof window === 'undefined') {
    // Se estivermos no servidor, retorna null ou um objeto vazio
    return null;
  }

  const formData = new window.FormData();
  Object.keys(data).forEach(key => {
    formData.append(key, data[key]);
  });
  return formData;
}
