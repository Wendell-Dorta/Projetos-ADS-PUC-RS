"use client";

import { ThemeProvider as MUIThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#5E35B1", // Roxo Profundo
      light: "#7E57C2",
      dark: "#4527A0",
    },
    secondary: {
      main: "#FF6F00", // Laranja
    },
    error: {
      main: "#D32F2F",
    },
    background: {
      default: "#FAFAFA",
      paper: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: "Inter, Roboto, sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none", // Remove texto todo em maiúsculo dos botões
          borderRadius: "8px",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        },
      },
    },
  },
});

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
      <ToastContainer position="bottom-right" theme="colored" />
    </MUIThemeProvider>
  );
}