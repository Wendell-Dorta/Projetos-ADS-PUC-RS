import { serieSchema } from '@/schemas/serieSchema';

describe('serieSchema validation', () => {
  const getLocalDateStr = (daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const baseValidData = {
    title: 'Valid Series',
    seasons: 3,
    releaseDate: getLocalDateStr(-5), // 5 days ago
    director: 'Some Director',
    producer: 'Some Producer',
    category: 'Drama',
    watchedDate: getLocalDateStr(0), // today
    rating: 4,
    status: 'Finalizada' as const,
  };

  it('should validate correctly with valid past and present dates', () => {
    const result = serieSchema.safeParse(baseValidData);
    expect(result.success).toBe(true);
  });

  it('should fail validation if releaseDate is in the future', () => {
    const invalidData = {
      ...baseValidData,
      releaseDate: getLocalDateStr(1), // tomorrow
    };
    const result = serieSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes('releaseDate'));
      expect(issue?.message).toBe('A data de lançamento não pode ser no futuro');
    }
  });

  it('should fail validation if watchedDate is in the future', () => {
    const invalidData = {
      ...baseValidData,
      watchedDate: getLocalDateStr(2), // day after tomorrow
    };
    const result = serieSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes('watchedDate'));
      expect(issue?.message).toBe('A data em que assistiu não pode ser no futuro');
    }
  });

  it('should fail validation if status is Planejando and rating is not zero', () => {
    const invalidData = {
      ...baseValidData,
      status: 'Planejando' as const,
      rating: 4,
    };
    const result = serieSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes('rating'));
      expect(issue?.message).toBe('Séries em planejamento não podem ter nota');
    }
  });

  it('should fail validation if status is Abandonada and rating is not zero', () => {
    const invalidData = {
      ...baseValidData,
      status: 'Abandonada' as const,
      rating: 3,
    };
    const result = serieSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes('rating'));
      expect(issue?.message).toBe('Séries abandonadas devem ter nota zero');
    }
  });

  it('should validate successfully if status is Planejando or Abandonada and rating is zero', () => {
    const validPlanejando = {
      ...baseValidData,
      status: 'Planejando' as const,
      rating: 0,
    };
    const validAbandonada = {
      ...baseValidData,
      status: 'Abandonada' as const,
      rating: 0,
    };
    
    expect(serieSchema.safeParse(validPlanejando).success).toBe(true);
    expect(serieSchema.safeParse(validAbandonada).success).toBe(true);
  });
});
