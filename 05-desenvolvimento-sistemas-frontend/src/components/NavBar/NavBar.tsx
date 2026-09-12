"use client";

import { AppBar, Toolbar, Typography, Button, Box, Container } from "@mui/material";
import MovieIcon from "@mui/icons-material/Movie";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Sobre", path: "/sobre" },
    { label: "Cadastrar", path: "/cadastrar" },
    { label: "Lista de séries", path: "/series" },
  ];

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "white", color: "primary.main", boxShadow: 1 }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters className="justify-between">
          <Box className="flex items-center gap-2">
            <MovieIcon fontSize="large" color="primary" />
            <Typography variant="h6" className="font-bold hidden sm:block">
              Series Journal
            </Typography>
          </Box>
          <Box className="flex gap-2">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path} passHref>
                <Button
                  variant={pathname === item.path ? "contained" : "text"}
                  color="primary"
                  className="rounded-full px-4"
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
