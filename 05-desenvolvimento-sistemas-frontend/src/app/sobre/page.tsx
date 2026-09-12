import { Typography, Container, Paper } from "@mui/material";

export default function SobrePage() {
  return (
    <Container maxWidth="md" className="pt-10 text-center">
      <Paper elevation={3} className="p-10 rounded-2xl">
        <Typography variant="h4" color="primary.dark" className="font-bold mb-4">
          Sobre o Projeto
        </Typography>
        <Typography variant="body1" className="text-gray-700 leading-relaxed mb-4">
          Este é um projeto de gerenciamento de séries assistidas desenvolvido com React e Next.js para a disciplina Desenvolvimento de Sistemas Frontend.
        </Typography>
        <Typography variant="body1" className="text-gray-700 leading-relaxed">
          Aqui você pode cadastrar, visualizar, editar e excluir séries assistidas de forma totalmente dinâmica e persistida localmente.
        </Typography>
      </Paper>
    </Container>
  );
}