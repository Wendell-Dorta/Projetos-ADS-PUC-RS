import React from 'react';
import { render, screen } from '@testing-library/react';
import NavBar from '@/components/NavBar/NavBar';

// Mock do next/navigation para simular a rota atual
jest.mock('next/navigation', () => ({
  usePathname() {
    return '/';
  },
}));

describe('NavBar Component', () => {
  it('deve renderizar o título do projeto "Series Journal"', () => {
    render(<NavBar />);
    expect(screen.getByText('Series Journal')).toBeInTheDocument();
  });

  it('deve renderizar os links de navegação principais', () => {
    render(<NavBar />);
    expect(screen.getByRole('button', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sobre/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cadastrar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /lista de séries/i })).toBeInTheDocument();
  });
});
