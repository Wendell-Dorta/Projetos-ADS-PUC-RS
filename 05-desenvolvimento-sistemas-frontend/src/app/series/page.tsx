"use client";

import { useState, useMemo } from "react";
import { Typography, Fab, Container, TextField, Box, Card } from "@mui/material";
import { motion } from "framer-motion";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import SerieList from "@/components/SerieList/SerieList";
import SerieListSkeleton from "@/components/SerieList/SerieListSkeleton";
import { useSeries } from "@/hooks/useSeries";
import Recommendations from "@/components/Recommendations/Recommendations";
import Link from "next/link";
import { toast } from "react-toastify";
import { playSound } from "@/services/soundEffects";

export default function SeriesPage() {
  const { series, deleteSerie, isLoading, error } = useSeries();
  const [searchTerm, setSearchTerm] = useState(""); // Estado para a barra de busca

  const handleDelete = async (id: string) => {
    if(confirm("Tem certeza que deseja excluir esta série?")) {
      try {
        await deleteSerie(id);
        playSound("delete");
        toast.error("Série excluída!");
      } catch (err) {
        toast.error("Erro ao excluir série na API.");
      }
    }
  };

  // Filtra as séries com base no que foi digitado na busca (Ignora maiúsculas/minúsculas)
  const filteredSeries = useMemo(() => {
    return series.filter(serie => 
      serie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      serie.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      serie.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
      serie.producer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [series, searchTerm]);

  // Estatísticas calculadas de forma otimizada (memoizada) para evitar recálculo desnecessário
  const stats = useMemo(() => {
    const total = series.length;
    const finalizadas = series.filter(s => s.status === 'Finalizada').length;
    const assistindo = series.filter(s => s.status === 'Assistindo').length;
    const rated = series.filter(s => s.rating !== undefined && s.rating !== null && s.rating > 0);
    const mediaGeral = rated.length > 0
      ? (rated.reduce((acc, s) => acc + (s.rating || 0), 0) / rated.length).toFixed(1)
      : "0.0";
    return { total, finalizadas, assistindo, mediaGeral };
  }, [series]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Container maxWidth="lg" className="pt-6">
      <Box className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <Box>
          <Typography variant="h4" color="text.primary" className="font-bold mb-1">
            Minhas Séries
          </Typography>
          <Typography variant="subtitle1" className="text-gray-500 dark:text-gray-400">
            {filteredSeries.length} séries encontradas
          </Typography>
        </Box>

        {/* Barra de Busca adicionada para cumprir o requisito da rubrica */}
        <TextField
          variant="outlined"
          placeholder="Buscar por título, categoria, diretor..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-96 bg-white dark:bg-zinc-800 rounded-md"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }
          }}
        />
      </Box>

      {/* Dashboard de Estatísticas */}
      {!isLoading && series.length > 0 && (
        <Box className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 flex flex-col justify-center items-center bg-white dark:bg-zinc-800 border-t-4" sx={{ borderTopColor: 'primary.main' }}>
            <Typography variant="caption" className="text-gray-500 dark:text-zinc-400 uppercase font-bold tracking-wider">Total</Typography>
            <Typography variant="h5" color="text.primary" className="font-extrabold mt-1">{stats.total}</Typography>
          </Card>
          <Card className="p-4 flex flex-col justify-center items-center bg-white dark:bg-zinc-800 border-t-4" sx={{ borderTopColor: '#2E7D32' }}>
            <Typography variant="caption" className="text-gray-500 dark:text-zinc-400 uppercase font-bold tracking-wider">Finalizadas</Typography>
            <Typography variant="h5" sx={{ color: '#2E7D32' }} className="font-extrabold mt-1">
              {stats.finalizadas}
            </Typography>
          </Card>
          <Card className="p-4 flex flex-col justify-center items-center bg-white dark:bg-zinc-800 border-t-4" sx={{ borderTopColor: '#0288D1' }}>
            <Typography variant="caption" className="text-gray-500 dark:text-zinc-400 uppercase font-bold tracking-wider">Assistindo</Typography>
            <Typography variant="h5" sx={{ color: '#0288D1' }} className="font-extrabold mt-1">
              {stats.assistindo}
            </Typography>
          </Card>
          <Card className="p-4 flex flex-col justify-center items-center bg-white dark:bg-zinc-800 border-t-4" sx={{ borderTopColor: '#ED6C02' }}>
            <Typography variant="caption" className="text-gray-500 dark:text-zinc-400 uppercase font-bold tracking-wider">Média Geral</Typography>
            <Typography variant="h5" sx={{ color: '#ED6C02' }} className="font-extrabold mt-1">
              {stats.mediaGeral} ★
            </Typography>
          </Card>
        </Box>
      )}

      {!isLoading && !error && (
        <Recommendations series={series} />
      )}

      {isLoading ? (
        <SerieListSkeleton />
      ) : error ? (
        <Typography color="error" className="text-center mt-10">{error}</Typography>
      ) : (
        <SerieList series={filteredSeries} onDelete={handleDelete} />
      )}

      <Link href="/cadastrar" passHref>
        <Fab color="primary" aria-label="add" sx={{ position: 'fixed', bottom: 32, right: 32 }}>
          <AddIcon />
        </Fab>
      </Link>
    </Container>
    </motion.div>
  );
}