import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SerieForm from '@/components/SerieForm/SerieForm';

// Mock do next/navigation para o useRouter e useSearchParams
const mockPush = jest.fn();
const mockGet = jest.fn().mockReturnValue(null);
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: mockPush,
    };
  },
  useSearchParams() {
    return {
      get: mockGet,
    };
  },
}));

describe('SerieForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar todos os campos obrigatórios do formulário', () => {
    render(<SerieForm onSubmit={jest.fn()} />);

    expect(screen.getByLabelText(/título da série \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/temporadas \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/categoria \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/data de lançamento \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/data em que assistiu \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/diretor \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/produtora \*/i)).toBeInTheDocument();
  });

  it('deve validar campos obrigatórios vazios ao submeter o formulário', async () => {
    render(<SerieForm onSubmit={jest.fn()} />);

    const submitButton = screen.getByRole('button', { name: /cadastrar série/i });
    fireEvent.click(submitButton);

    // Espera as mensagens de erro do Zod aparecerem na tela
    await waitFor(() => {
      expect(screen.getByText('O título é obrigatório')).toBeInTheDocument();
      expect(screen.getByText('Data de lançamento é obrigatória')).toBeInTheDocument();
      expect(screen.getByText('Diretor é obrigatório')).toBeInTheDocument();
      expect(screen.getByText('Produtora é obrigatória')).toBeInTheDocument();
      expect(screen.getByText('Categoria é obrigatória')).toBeInTheDocument();
      expect(screen.getByText('Data em que assistiu é obrigatória')).toBeInTheDocument();
    });
  });

  it('deve chamar onSubmit com os dados corretos se o formulário for preenchido de forma válida', async () => {
    const mockOnSubmit = jest.fn();
    render(<SerieForm onSubmit={mockOnSubmit} />);

    // Preenche os campos text/number/date
    fireEvent.change(screen.getByLabelText(/título da série \*/i), { target: { value: 'Breaking Bad' } });
    fireEvent.change(screen.getByLabelText(/temporadas \*/i), { target: { value: '5' } });
    
    // Abre o select de categoria do MUI e seleciona a opção
    const categorySelect = screen.getByLabelText(/categoria \*/i);
    fireEvent.mouseDown(categorySelect);
    const categoryOption = await screen.findByRole('option', { name: 'Drama' });
    fireEvent.click(categoryOption);

    fireEvent.change(screen.getByLabelText(/data de lançamento \*/i), { target: { value: '2008-01-20' } });
    fireEvent.change(screen.getByLabelText(/data em que assistiu \*/i), { target: { value: '2024-03-14' } });
    fireEvent.change(screen.getByLabelText(/diretor \*/i), { target: { value: 'Vince Gilligan' } });
    fireEvent.change(screen.getByLabelText(/produtora \*/i), { target: { value: 'Sony Pictures' } });

    const submitButton = screen.getByRole('button', { name: /cadastrar série/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Breaking Bad',
        seasons: 5,
        category: 'Drama',
        releaseDate: '2008-01-20',
        watchedDate: '2024-03-14',
        director: 'Vince Gilligan',
        producer: 'Sony Pictures',
        rating: 0,
        status: 'Finalizada',
      });
    });
  });

  it('deve exibir mensagem de erro se a data de lançamento ou a data em que assistiu for no futuro', async () => {
    const mockOnSubmit = jest.fn();
    render(<SerieForm onSubmit={mockOnSubmit} />);

    // Preenche com datas futuras
    const getFutureLocalDateStr = (daysAhead: number) => {
      const d = new Date();
      d.setDate(d.getDate() + daysAhead);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };
    const tomorrowStr = getFutureLocalDateStr(1);

    fireEvent.change(screen.getByLabelText(/título da série \*/i), { target: { value: 'Future Series' } });
    fireEvent.change(screen.getByLabelText(/temporadas \*/i), { target: { value: '1' } });

    const categorySelect = screen.getByLabelText(/categoria \*/i);
    fireEvent.mouseDown(categorySelect);
    const categoryOption = await screen.findByRole('option', { name: 'Drama' });
    fireEvent.click(categoryOption);

    const releaseDateInput = screen.getByLabelText(/data de lançamento \*/i);
    const watchedDateInput = screen.getByLabelText(/data em que assistiu \*/i);

    fireEvent.change(releaseDateInput, { target: { value: tomorrowStr } });
    fireEvent.change(watchedDateInput, { target: { value: tomorrowStr } });

    fireEvent.change(screen.getByLabelText(/diretor \*/i), { target: { value: 'Future Director' } });
    fireEvent.change(screen.getByLabelText(/produtora \*/i), { target: { value: 'Future Prod' } });

    const submitButton = screen.getByRole('button', { name: /cadastrar série/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('A data de lançamento não pode ser no futuro')).toBeInTheDocument();
      expect(screen.getByText('A data em que assistiu não pode ser no futuro')).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
