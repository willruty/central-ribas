// Configuração de URL base da API
const API_URL_ENV = process.env.EXPO_PUBLIC_API_URL ||
                    process.env.REACT_APP_API_URL ||
                    'http://localhost:3000';

export const API_CONFIG = {
  baseUrl: API_URL_ENV,
};
