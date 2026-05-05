// Configuração de URL base da API
const API_URL_ENV = import.meta.env.VITE_API_URL ||
                    process.env.REACT_APP_API_URL ||
                    'http://localhost:3000';

export const API_CONFIG = {
  baseUrl: API_URL_ENV,
};
