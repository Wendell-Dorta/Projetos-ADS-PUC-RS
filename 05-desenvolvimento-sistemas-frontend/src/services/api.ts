import axios from 'axios';

// Instância do Axios apontando para a API fornecida pelo professor
export const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // withCredentials: false garante que cookies/credenciais locais não sejam compartilhados desnecessariamente,
  // evitando restrições estritas de CORS na API local do professor.
  withCredentials: false,
});
