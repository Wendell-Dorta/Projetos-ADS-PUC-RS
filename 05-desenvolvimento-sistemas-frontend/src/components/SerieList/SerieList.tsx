"use client";

import { Serie } from "@/types/serie";
import { Card, CardContent, Typography, IconButton, Chip, Box, Tooltip, Rating, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TvIcon from "@mui/icons-material/Tv";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";
import { playSound } from "@/services/soundEffects";

interface SerieListProps {
  series: Serie[];
  onDelete: (id: string) => void;
}

const getStatusConfig = (status?: string) => {
  switch (status) {
    case 'Assistindo':
      return { color: '#0288D1', label: 'Assistindo', chipColor: 'info' as const };
    case 'Finalizada':
      return { color: '#2E7D32', label: 'Finalizada', chipColor: 'success' as const };
    case 'Planejando':
      return { color: '#ED6C02', label: 'Planejando', chipColor: 'warning' as const };
    case 'Abandonada':
      return { color: '#D32F2F', label: 'Abandonada', chipColor: 'error' as const };
    default:
      return null;
  }
};

const safeFormatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  try {
    const parsed = parseISO(dateString);
    if (isNaN(parsed.getTime())) {
      return dateString;
    }
    return format(parsed, "dd/MM/yyyy", { locale: ptBR });
  } catch (error) {
    return dateString;
  }
};

export default function SerieList({ series, onDelete }: SerieListProps) {
  if (series.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-zinc-800 rounded-2xl shadow-md border border-gray-100 dark:border-zinc-800 max-w-lg mx-auto mt-10"
      >
        <Box className="bg-purple-100 dark:bg-purple-950 p-4 rounded-full text-primary mb-4" sx={{ color: 'primary.main' }}>
          <TvIcon sx={{ fontSize: 60 }} />
        </Box>
        <Typography variant="h5" className="font-bold mb-2 text-zinc-800 dark:text-zinc-100">
          Seu diário está vazio!
        </Typography>
        <Typography variant="body2" className="text-gray-500 dark:text-zinc-400 mb-6 max-w-xs">
          Nenhuma série cadastrada ainda.
        </Typography>
        <Link href="/cadastrar" passHref>
          <Button variant="contained" color="primary">
            Cadastrar Primeira Série
          </Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {series.map((serie, index) => {
        const statusConfig = getStatusConfig(serie.status);
        const borderColor = statusConfig ? statusConfig.color : (index % 2 === 0 ? '#5E35B1' : '#FF6F00');
        
        return (
          <motion.div
            key={serie.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card 
              className="relative overflow-hidden h-full"
              sx={{ borderTop: `6px solid ${borderColor}`, bgcolor: 'background.paper' }}
            >
              <CardContent className="flex flex-col h-full">
                <Typography variant="h6" color="text.primary" className="font-bold mb-2">
                  {serie.title}
                </Typography>
                
                <Box className="flex items-center gap-2 mb-4 justify-between flex-wrap">
                  <Box className="flex gap-2 flex-wrap">
                    <Chip 
                      label={serie.category} 
                      size="small" 
                      variant="outlined" 
                      color="primary" 
                    />
                    {statusConfig && (
                      <Chip 
                        label={statusConfig.label} 
                        size="small" 
                        color={statusConfig.chipColor} 
                      />
                    )}
                  </Box>
                  {serie.rating !== undefined && serie.rating > 0 && (
                    <Rating value={serie.rating} readOnly size="small" />
                  )}
                </Box>

                <Box className="flex flex-col gap-2 text-gray-700 dark:text-zinc-300 text-sm flex-grow">
                  <span className="flex items-center gap-2"><TvIcon fontSize="small"/> <b>Temporadas:</b> {serie.seasons}</span>
                  <span className="flex items-center gap-2"><PersonIcon fontSize="small"/> <b>Diretor:</b> {serie.director}</span>
                  <span className="flex items-center gap-2"><BusinessIcon fontSize="small"/> <b>Produtora:</b> {serie.producer}</span>
                  <span className="flex items-center gap-2"><CalendarTodayIcon fontSize="small"/> <b>Lançamento:</b> {safeFormatDate(serie.releaseDate)}</span>
                  <span className="flex items-center gap-2"><VisibilityIcon fontSize="small"/> <b>Assistido em:</b> {safeFormatDate(serie.watchedDate)}</span>
                </Box>

                <Box className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
                  <Tooltip title="Editar">
                    <Link href={`/cadastrar?id=${serie.id}`}>
                      <IconButton 
                        color="primary" 
                        size="small" 
                        aria-label={`Editar série ${serie.title}`}
                        onClick={() => playSound("click")}
                      >
                        <EditIcon />
                      </IconButton>
                    </Link>
                  </Tooltip>
                  <Tooltip title="Excluir">
                    <IconButton 
                      color="error" 
                      size="small" 
                      aria-label={`Excluir série ${serie.title}`}
                      onClick={() => onDelete(serie.id as string)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
