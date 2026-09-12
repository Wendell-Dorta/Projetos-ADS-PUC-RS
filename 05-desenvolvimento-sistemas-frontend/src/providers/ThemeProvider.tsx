"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ThemeProvider as MUIThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const ColorModeContext = createContext({
  toggleColorMode: () => {},
  mode: 'light' as 'light' | 'dark'
});

export function useColorMode() {
  return useContext(ColorModeContext);
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const queryClient = React.useMemo(() => new QueryClient(), []);

  // Recupera o tema do localStorage ou preferência do sistema
  useEffect(() => {
    const savedMode = localStorage.getItem("theme_mode") as 'light' | 'dark';
    if (savedMode) {
      setMode(savedMode);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setMode("dark");
    }
  }, []);

  // Sincroniza a classe dark na tag html para o Tailwind v4
  useEffect(() => {
    const root = window.document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [mode]);

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          localStorage.setItem("theme_mode", newMode);
          return newMode;
        });
      },
      mode
    }),
    [mode]
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'light' ? "#5E35B1" : "#9575CD",
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
            default: mode === 'light' ? "#FAFAFA" : "#0A0E1A",
            paper: mode === 'light' ? "#FFFFFF" : "#151B2E",
          },
        },
        typography: {
          fontFamily: "Inter, Roboto, sans-serif",
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: "none",
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
      }),
    [mode]
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ColorModeContext.Provider value={colorMode}>
        <MUIThemeProvider theme={theme}>
          <CssBaseline />
          {children}
          <ToastContainer position="bottom-right" theme={mode === 'light' ? 'colored' : 'dark'} />
        </MUIThemeProvider>
      </ColorModeContext.Provider>
    </QueryClientProvider>
  );
}