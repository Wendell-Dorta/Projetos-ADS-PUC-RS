import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/providers/ThemeProvider";
import NavBar from "@/components/NavBar/NavBar";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";

export const metadata: Metadata = {
  title: "Series Journal",
  description: "Gerencie suas séries assistidas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider>
            <NavBar />
            <main className="min-h-screen bg-background text-foreground p-6 pb-24 transition-colors duration-300">
              {children}
            </main>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}