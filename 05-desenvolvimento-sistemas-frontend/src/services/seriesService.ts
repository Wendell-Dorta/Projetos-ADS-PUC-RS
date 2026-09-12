import { api } from './api';
import { Serie } from '@/types/serie';

// Helper to map API data (which might use "production" and "watchedAt") to our frontend Serie type
const mapSerieFromApi = (data: any): Serie => {
  if (!data) return data;
  return {
    ...data,
    producer: data.producer || data.production || '',
    watchedDate: data.watchedDate || data.watchedAt || '',
  };
};

// Helper to map frontend Serie data to API data, sending both sets of keys to be fully compatible with any database state
const mapSerieToApi = (serie: Omit<Serie, 'id'>) => {
  return {
    ...serie,
    // Send both sets of keys to ensure compatibility with professor's original database schema
    production: (serie as any).producer,
    watchedAt: (serie as any).watchedDate,
  };
};

export const seriesService = {
  // GET: Retorna a lista de todas as séries
  getSeries: async (): Promise<Serie[]> => {
    const response = await api.get<any[]>('/series');
    return (response.data || []).map(mapSerieFromApi);
  },

  // GET: Retorna uma série específica pelo ID
  getSerieById: async (id: string | number): Promise<Serie> => {
    const response = await api.get<any>(`/series/${id}`);
    return mapSerieFromApi(response.data);
  },

  // POST: Cadastra uma nova série
  addSerie: async (serie: Omit<Serie, 'id'>): Promise<Serie> => {
    const payload = mapSerieToApi(serie);
    const response = await api.post<any>('/series', payload);
    return mapSerieFromApi(response.data);
  },

  // PUT: Atualiza os dados de uma série
  updateSerie: async (id: string | number, serie: Omit<Serie, 'id'>): Promise<Serie> => {
    const payload = { ...mapSerieToApi(serie), id: Number(id) };
    const response = await api.put<any>('/series', payload);
    return mapSerieFromApi(response.data);
  },

  // DELETE: Remove uma série pelo ID
  deleteSerie: async (id: string | number): Promise<void> => {
    await api.delete(`/series/${id}`);
  },
};
