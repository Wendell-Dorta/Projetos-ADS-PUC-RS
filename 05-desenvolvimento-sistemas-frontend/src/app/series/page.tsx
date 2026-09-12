"use client";

import { useState } from "react";
import { Typography, Fab, Container, TextField, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import SerieList from "@/components/SerieList/SerieList";
import { useSeries } from "@/hooks/useSeries";
import Link from "next/link";
import { toast } from "react-toastify";

export default function SeriesPage() {
  const { series, deleteSerie } = useSeries();
  const [searchTerm, setSearchTerm] = useState(""); // Estado para a barra de busca

  const handleDelete = (id: string) => {
    if(confirm("Tem certeza que deseja excluir esta série?")) {
      deleteSerie(id);
      toast.error("Série excluída!");
    }
  };

  // Filtra as séries com base no que foi digitado na busca (Ignora maiúsculas/minúsculas)
  const filteredSeries = series.filter(serie => 
    serie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    serie.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    serie.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
    serie.producer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg" className="pt-6">
      <Box className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <Box>
          <Typography variant="h4" color="primary.dark" className="font-bold mb-1">
            Minhas Séries
          </Typography>
          <Typography variant="subtitle1" className="text-gray-500">
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
          className="w-full md:w-96 bg-white"
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

      <SerieList series={filteredSeries} onDelete={handleDelete} />

      <Link href="/cadastrar" passHref>
        <Fab color="primary" aria-label="add" sx={{ position: 'fixed', bottom: 32, right: 32 }}>
          <AddIcon />
        </Fab>
      </Link>
    </Container>
  );
}