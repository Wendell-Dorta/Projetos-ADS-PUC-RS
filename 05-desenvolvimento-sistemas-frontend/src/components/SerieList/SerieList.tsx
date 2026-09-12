"use client";

import { Serie } from "@/types/serie";
import { Card, CardContent, Typography, IconButton, Chip, Box, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TvIcon from "@mui/icons-material/Tv";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Link from "next/link";

interface SerieListProps {
  series: Serie[];
  onDelete: (id: string) => void;
}

export default function SerieList({ series, onDelete }: SerieListProps) {
  if (series.length === 0) {
    return <Typography className="text-center mt-10">Nenhuma série cadastrada ainda.</Typography>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {series.map((serie, index) => (
        <Card 
          key={serie.id} 
          className="relative overflow-hidden"
          sx={{ borderTop: `6px solid ${index % 2 === 0 ? '#5E35B1' : '#FF6F00'}` }}
        >
          <CardContent className="flex flex-col h-full">
            <Typography variant="h6" color="primary.dark" className="font-bold mb-2">
              {serie.title}
            </Typography>
            
            <Chip 
              label={serie.category} 
              size="small" 
              variant="outlined" 
              color="primary" 
              className="mb-4 w-fit"
            />

            <Box className="flex flex-col gap-2 text-gray-700 text-sm flex-grow">
              <span className="flex items-center gap-2"><TvIcon fontSize="small"/> <b>Temporadas:</b> {serie.seasons}</span>
              <span className="flex items-center gap-2"><PersonIcon fontSize="small"/> <b>Diretor:</b> {serie.director}</span>
              <span className="flex items-center gap-2"><BusinessIcon fontSize="small"/> <b>Produtora:</b> {serie.producer}</span>
              <span className="flex items-center gap-2"><CalendarTodayIcon fontSize="small"/> <b>Lançamento:</b> {new Date(serie.releaseDate).toLocaleDateString('pt-BR')}</span>
              <span className="flex items-center gap-2"><VisibilityIcon fontSize="small"/> <b>Assistido em:</b> {new Date(serie.watchedDate).toLocaleDateString('pt-BR')}</span>
            </Box>

            <Box className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
              <Tooltip title="Editar">
                <Link href={`/cadastrar?id=${serie.id}`}>
                  <IconButton color="primary" size="small"><EditIcon /></IconButton>
                </Link>
              </Tooltip>
              <Tooltip title="Excluir">
                <IconButton color="error" size="small" onClick={() => onDelete(serie.id as string)}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
