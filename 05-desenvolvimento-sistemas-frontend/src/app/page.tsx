"use client";

import { Typography, Box, Button } from '@mui/material';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <Box className="flex flex-col items-center justify-center min-h-[70vh] gap-6 text-center">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Box className="bg-primary-main rounded-full p-6 shadow-xl mb-4 text-white" sx={{ bgcolor: 'primary.main' }}>
           <LiveTvIcon sx={{ fontSize: 80 }} />
        </Box>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" color="text.primary" className="font-bold">
          Bem-vindo ao Series Journal
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Typography variant="h6" className="text-gray-600 dark:text-gray-400 max-w-2xl">
          Seu diário pessoal para gerenciar e acompanhar todas as séries que você assiste. Organize, edite e nunca mais perca o controle do que está assistindo!
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
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
      </motion.div>
    </Box>
  );
}