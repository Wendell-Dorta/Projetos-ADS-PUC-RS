"use client";

import { AppBar, Toolbar, Typography, Button, Box, Container, IconButton } from "@mui/material";
import MovieIcon from "@mui/icons-material/Movie";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useColorMode } from "@/providers/ThemeProvider";
import { useState, useEffect } from "react";
import { playSound } from "@/services/soundEffects";

export default function NavBar() {
  const pathname = usePathname();
  const { toggleColorMode, mode } = useColorMode();
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const isMuted = localStorage.getItem("mute_sounds") === "true";
    setSoundEnabled(!isMuted);
  }, []);

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    localStorage.setItem("mute_sounds", nextState ? "false" : "true");
    if (nextState) {
      setTimeout(() => playSound("click"), 50);
    }
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Sobre", path: "/sobre" },
    { label: "Cadastrar", path: "/cadastrar" },
    { label: "Lista de séries", path: "/series" },
  ];

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        backdropFilter: "blur(12px)",
        backgroundColor: mode === 'light' ? "rgba(250, 250, 250, 0.8)" : "rgba(10, 14, 26, 0.8)",
        color: "primary.main",
        boxShadow: "none",
        borderBottom: "1px solid",
        borderColor: mode === 'light' ? "rgba(0, 0, 0, 0.06)" : "rgba(255, 255, 255, 0.06)",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters className="justify-between">
          <Box className="flex items-center gap-2">
            <MovieIcon fontSize="large" color="primary" />
            <Typography variant="h6" className="font-bold hidden sm:block">
              Series Journal
            </Typography>
          </Box>
          <Box className="flex items-center gap-2">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path} passHref>
                <Button
                  variant={pathname === item.path ? "contained" : "text"}
                  color="primary"
                  className="rounded-full px-4"
                  onClick={() => playSound("click")}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
            <IconButton onClick={toggleColorMode} color="primary" aria-label="Alterar tema">
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            <IconButton onClick={toggleSound} color="primary" aria-label={soundEnabled ? "Mudar para mudo" : "Ativar som"}>
              {soundEnabled ? <VolumeUpIcon /> : <VolumeOffIcon />}
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
