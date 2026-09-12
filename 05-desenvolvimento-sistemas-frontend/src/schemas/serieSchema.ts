import { z } from 'zod';

const dateNotFuture = (val: string) => {
  if (!val) return true;
  const [year, month, day] = val.split('-').map(Number);
  const inputDate = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return inputDate <= today;
};

export const serieSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório'),
  seasons: z.number().int().min(1, 'Deve ter pelo menos 1 temporada'),
  releaseDate: z.string().min(1, 'Data de lançamento é obrigatória').refine(dateNotFuture, {
    message: 'A data de lançamento não pode ser no futuro'
  }),
  director: z.string().min(1, 'Diretor é obrigatório'),
  producer: z.string().min(1, 'Produtora é obrigatória'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  watchedDate: z.string().min(1, 'Data em que assistiu é obrigatória').refine(dateNotFuture, {
    message: 'A data em que assistiu não pode ser no futuro'
  }),
  rating: z.number().min(0).max(5).optional(),
  status: z.enum(['Assistindo', 'Finalizada', 'Planejando', 'Abandonada']).optional(),
}).superRefine((data, ctx) => {
  if (data.status === 'Planejando' && data.rating !== undefined && data.rating !== 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Séries em planejamento não podem ter nota',
      path: ['rating'],
    });
  }
  if (data.status === 'Abandonada' && data.rating !== undefined && data.rating !== 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Séries abandonadas devem ter nota zero',
      path: ['rating'],
    });
  }
});

export type SerieFormData = z.infer<typeof serieSchema>;