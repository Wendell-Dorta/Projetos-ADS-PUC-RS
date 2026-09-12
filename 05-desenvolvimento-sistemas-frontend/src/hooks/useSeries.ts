"use client";

import { useState, useEffect } from "react";
import { Serie } from "@/types/serie";

const STORAGE_KEY = "series_journal_data";

// Dados iniciais para a tela não ficar vazia na primeira vez
const mockSeries: Serie[] = [
  { id: "1", title: "Breaking Bad", seasons: 5, releaseDate: "2008-01-20", director: "Vince Gilligan", producer: "Sony Pictures", category: "Drama", watchedDate: "2024-03-14" },
  { id: "2", title: "Stranger Things", seasons: 4, releaseDate: "2016-07-15", director: "Duffer Brothers", producer: "Netflix", category: "Ficção Científica", watchedDate: "2024-01-19" },
];

export function useSeries() {
  const [series, setSeries] = useState<Serie[]>([]);

  // Carrega do LocalStorage ao montar o componente
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setSeries(JSON.parse(saved));
    } else {
      setSeries(mockSeries);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockSeries));
    }
  }, []);

  const saveToStorage = (newData: Serie[]) => {
    setSeries(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  };

  const addSerie = (serie: Serie) => {
    const newSerie = { ...serie, id: crypto.randomUUID() };
    saveToStorage([newSerie, ...series]);
  };

  const updateSerie = (id: string, updatedSerie: Serie) => {
    const newData = series.map((s) => (s.id === id ? { ...updatedSerie, id } : s));
    saveToStorage(newData);
  };

  const deleteSerie = (id: string) => {
    const newData = series.filter((s) => s.id !== id);
    saveToStorage(newData);
  };

  const getSerieById = (id: string) => series.find((s) => s.id === id);

  return { series, addSerie, updateSerie, deleteSerie, getSerieById };
}