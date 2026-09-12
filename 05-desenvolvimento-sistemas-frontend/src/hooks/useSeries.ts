"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Serie } from "@/types/serie";
import { seriesService } from "@/services/seriesService";

export function useSeries() {
  const queryClient = useQueryClient();

  // GET: Busca a lista de séries da API usando o cache do React Query
  const { data: series = [], isLoading, error } = useQuery<Serie[], Error>({
    queryKey: ["series"],
    queryFn: seriesService.getSeries,
  });

  // POST: Cadastra uma nova série e invalida o cache
  const addMutation = useMutation({
    mutationFn: seriesService.addSerie,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["series"] });
    },
  });

  // PUT: Atualiza uma série existente e invalida o cache
  const updateMutation = useMutation({
    mutationFn: ({ id, updatedSerie }: { id: string | number; updatedSerie: Omit<Serie, "id"> }) =>
      seriesService.updateSerie(id, updatedSerie),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["series"] });
    },
  });

  // DELETE: Remove uma série pelo ID e invalida o cache
  const deleteMutation = useMutation({
    mutationFn: seriesService.deleteSerie,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["series"] });
    },
  });

  const getSerieById = (id: string | number) => {
    return series.find((s) => String(s.id) === String(id));
  };

  return {
    series,
    isLoading: isLoading || addMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    error: error ? "Erro ao carregar séries da API. Verifique se o servidor está rodando." : null,
    addSerie: async (serie: Omit<Serie, "id">) => addMutation.mutateAsync(serie),
    updateSerie: async (id: string | number, updatedSerie: Omit<Serie, "id">) =>
      updateMutation.mutateAsync({ id, updatedSerie }),
    deleteSerie: async (id: string | number) => deleteMutation.mutateAsync(id),
    getSerieById,
    refreshSeries: async () => {
      queryClient.invalidateQueries({ queryKey: ["series"] });
    },
  };
}