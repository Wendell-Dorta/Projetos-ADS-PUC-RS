import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SerieList from '@/components/SerieList/SerieList';
import { Serie } from '@/types/serie';

const mockSeries: Serie[] = [
  {
    id: "1",
    title: "Breaking Bad",
    seasons: 5,
    releaseDate: "2008-01-20",
    director: "Vince Gilligan",
    producer: "Sony Pictures",
    category: "Drama",
    watchedDate: "2024-03-14",
  },
  {
    id: "2",
    title: "Stranger Things",
    seasons: 4,
    releaseDate: "2016-07-15",
    director: "Duffer Brothers",
    producer: "Netflix",
    category: "Ficção Científica",
    watchedDate: "2024-01-19",
  },
];

describe('SerieList Component', () => {
  it('deve exibir mensagem quando a lista de séries estiver vazia', () => {
    render(<SerieList series={[]} onDelete={jest.fn()} />);
    expect(screen.getByText('Nenhuma série cadastrada ainda.')).toBeInTheDocument();
  });

  it('deve renderizar os cartões com as informações das séries fornecidas', () => {
    render(<SerieList series={mockSeries} onDelete={jest.fn()} />);
    expect(screen.getByText('Breaking Bad')).toBeInTheDocument();
    expect(screen.getByText('Stranger Things')).toBeInTheDocument();
  });

  it('deve disparar a função onDelete ao clicar no botão excluir', () => {
    const mockOnDelete = jest.fn();
    render(<SerieList series={mockSeries} onDelete={mockOnDelete} />);
    
    // Pega o botão de exclusão da primeira série (Breaking Bad)
    const deleteButtons = screen.getAllByRole('button');
    // Filtrando o botão que tenha o ícone de delete (ou a tag correspondente)
    // No nosso componente o botão de excluir tem a prop title="Excluir" no Tooltip e a tag aria-label no botão ou simplesmente envolve o IconButton
    // Vamos interagir com o primeiro botão de excluir clicando nele
    const deleteButton = screen.getAllByRole('button').find(button => button.innerHTML.includes('DeleteIcon') || button.closest('[title="Excluir"]'));
    
    if (deleteButton) {
      fireEvent.click(deleteButton);
      expect(mockOnDelete).toHaveBeenCalledWith("1");
    }
  });
});
