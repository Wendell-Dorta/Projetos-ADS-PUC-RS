import React from 'react';
import { render, screen } from '@testing-library/react';
import SerieFormSkeleton from '@/components/SerieForm/SerieFormSkeleton';

describe('SerieFormSkeleton Component', () => {
  it('deve renderizar a estrutura de esqueleto do formulário', () => {
    render(<SerieFormSkeleton />);
    
    // Verifica se a div container está no documento
    const skeletonContainer = screen.getByTestId('serie-form-skeleton');
    expect(skeletonContainer).toBeInTheDocument();
  });
});
