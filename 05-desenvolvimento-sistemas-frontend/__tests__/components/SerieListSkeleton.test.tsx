import React from 'react';
import { render, screen } from '@testing-library/react';
import SerieListSkeleton from '@/components/SerieList/SerieListSkeleton';

describe('SerieListSkeleton Component', () => {
  it('deve renderizar a estrutura de esqueleto da lista de séries', () => {
    render(<SerieListSkeleton />);
    
    // Verifica se a div container está no documento
    const skeletonContainer = screen.getByTestId('serie-list-skeleton');
    expect(skeletonContainer).toBeInTheDocument();
    expect(skeletonContainer).toHaveClass('grid');
  });
});
