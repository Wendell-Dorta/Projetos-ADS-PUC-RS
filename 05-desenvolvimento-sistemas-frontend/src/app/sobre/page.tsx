"use client";

import { Typography, Container, Paper } from "@mui/material";
import { motion } from "framer-motion";

export default function SobrePage() {
  return (
    <Container maxWidth="md" className="pt-10 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={3} className="p-10 rounded-2xl">
          <Typography variant="h4" color="text.primary" className="font-bold mb-4">
            Sobre o Projeto
          </Typography>
          <Typography variant="body1" className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            Este é um projeto de gerenciamento de séries assistidas desenvolvido com React e Next.js para a disciplina Desenvolvimento de Sistemas Frontend.
          </Typography>
          <Typography variant="body1" className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Aqui você pode cadastrar, visualizar, editar e excluir séries assistidas de forma totalmente dinâmica e persistida localmente.
          </Typography>
        </Paper>
      </motion.div>
    </Container>
  );
}