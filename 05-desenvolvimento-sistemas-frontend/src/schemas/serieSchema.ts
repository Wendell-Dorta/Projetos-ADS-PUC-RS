import { z } from 'zod';

export const serieSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório'),
  seasons: z.number().int().min(1, 'Deve ter pelo menos 1 temporada'),
  releaseDate: z.string().min(1, 'Data de lançamento é obrigatória'),
  director: z.string().min(1, 'Diretor é obrigatório'),
  producer: z.string().min(1, 'Produtora é obrigatória'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  watchedDate: z.string().min(1, 'Data em que assistiu é obrigatória'),
});

export type SerieFormData = z.infer<typeof serieSchema>;