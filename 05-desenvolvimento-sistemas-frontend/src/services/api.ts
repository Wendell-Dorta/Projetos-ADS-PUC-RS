import axios from 'axios';

// Instância do Axios apontando para a API fornecida pelo professor
export const api = axios.create({
  baseURL: 'http://localhost:5000',
});
