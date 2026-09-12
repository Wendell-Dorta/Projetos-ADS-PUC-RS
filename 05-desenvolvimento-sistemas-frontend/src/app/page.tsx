import { Typography, Box, Button } from '@mui/material';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import Link from 'next/link';

export default function Home() {
  return (
    <Box className="flex flex-col items-center justify-center min-h-[70vh] gap-6 text-center">
      <Box className="bg-primary-main rounded-full p-6 shadow-xl mb-4 text-white" sx={{ bgcolor: 'primary.main' }}>
         <LiveTvIcon sx={{ fontSize: 80 }} />
      </Box>
      <Typography variant="h3" component="h1" color="primary.dark" className="font-bold">
        Bem-vindo ao Series Journal
      </Typography>
      <Typography variant="h6" className="text-gray-600 max-w-2xl">
        Seu diário pessoal para gerenciar e acompanhar todas as séries que você assiste. Organize, edite e nunca mais perca o controle do que está assistindo!
      </Typography>
      <Box className="flex gap-4 mt-4">
        <Link href="/series" passHref>
          <Button variant="contained" color="primary" size="large" startIcon={<LiveTvIcon />}>
            Ver Minhas Séries
          </Button>
        </Link>
        <Link href="/sobre" passHref>
          <Button variant="outlined" color="primary" size="large">
            Sobre o Projeto
          </Button>
        </Link>
      </Box>
    </Box>
  );
}