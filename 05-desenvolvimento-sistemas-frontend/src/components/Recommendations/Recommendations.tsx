"use client";

import { useEffect, useState } from "react";
import { Serie } from "@/types/serie";
import { tvMazeService, TvShowSuggestion } from "@/services/tvMazeService";
import { Card, CardContent, Typography, Box, Button, CircularProgress, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface RecommendationsProps {
  series: Serie[];
}

// Interface para estruturar nosso catálogo interno de séries populares de alta qualidade
interface CuratedShow {
  name: string;
  genres: string[];
  producer: string;
  isAnime: boolean;
  isSuperhero: boolean;
}

// Catálogo seletivo de séries aclamadas para garantir 100% de presença de imagens de pôster e nomes corretos
const CURATED_CATALOG: CuratedShow[] = [
  // Drama / Crime
  { name: "Peaky Blinders", genres: ["Drama", "Crime"], producer: "BBC One", isAnime: false, isSuperhero: false },
  { name: "Better Call Saul", genres: ["Drama", "Crime"], producer: "AMC", isAnime: false, isSuperhero: false },
  { name: "Succession", genres: ["Drama"], producer: "HBO", isAnime: false, isSuperhero: false },
  { name: "Narcos", genres: ["Drama", "Crime"], producer: "Netflix", isAnime: false, isSuperhero: false },
  { name: "Sherlock", genres: ["Drama", "Crime"], producer: "BBC One", isAnime: false, isSuperhero: false },
  { name: "Mindhunter", genres: ["Drama", "Crime"], producer: "Netflix", isAnime: false, isSuperhero: false },
  { name: "True Detective", genres: ["Drama", "Crime"], producer: "HBO", isAnime: false, isSuperhero: false },
  { name: "Ozark", genres: ["Drama", "Crime"], producer: "Netflix", isAnime: false, isSuperhero: false },
  { name: "Chernobyl", genres: ["Drama"], producer: "HBO", isAnime: false, isSuperhero: false },
  { name: "The Crown", genres: ["Drama"], producer: "Netflix", isAnime: false, isSuperhero: false },

  // Comédia
  { name: "Brooklyn Nine-Nine", genres: ["Comédia"], producer: "NBC", isAnime: false, isSuperhero: false },
  { name: "Modern Family", genres: ["Comédia"], producer: "ABC", isAnime: false, isSuperhero: false },
  { name: "Ted Lasso", genres: ["Comédia", "Drama"], producer: "Apple TV+", isAnime: false, isSuperhero: false },
  { name: "Parks and Recreation", genres: ["Comédia"], producer: "NBC", isAnime: false, isSuperhero: false },
  { name: "The Big Bang Theory", genres: ["Comédia"], producer: "CBS", isAnime: false, isSuperhero: false },
  { name: "Friends", genres: ["Comédia"], producer: "NBC", isAnime: false, isSuperhero: false },
  { name: "The Good Place", genres: ["Comédia", "Fantasia"], producer: "NBC", isAnime: false, isSuperhero: false },

  // Ficção Científica / Fantasia
  { name: "Black Mirror", genres: ["Ficção Científica", "Drama"], producer: "Netflix", isAnime: false, isSuperhero: false },
  { name: "Severance", genres: ["Ficção Científica", "Drama"], producer: "Apple TV+", isAnime: false, isSuperhero: false },
  { name: "Westworld", genres: ["Ficção Científica", "Drama"], producer: "HBO", isAnime: false, isSuperhero: false },
  { name: "The Expanse", genres: ["Ficção Científica", "Ação"], producer: "Amazon Prime", isAnime: false, isSuperhero: false },

  // Ação / Aventura / Heróis
  { name: "The Boys", genres: ["Ação", "Ficção Científica"], producer: "Amazon Prime", isAnime: false, isSuperhero: true },
  { name: "Reacher", genres: ["Ação", "Crime"], producer: "Amazon Prime", isAnime: false, isSuperhero: false },
  { name: "Loki", genres: ["Ação", "Ficção Científica", "Fantasia"], producer: "Disney+", isAnime: false, isSuperhero: true },
  { name: "Daredevil", genres: ["Ação", "Crime"], producer: "Netflix", isAnime: false, isSuperhero: true },
  { name: "The Punisher", genres: ["Ação", "Crime"], producer: "Netflix", isAnime: false, isSuperhero: true },

  // Super-Heróis (específico)
  { name: "Supergirl", genres: ["Ação", "Ficção Científica", "Aventura"], producer: "The CW", isAnime: false, isSuperhero: true },
  { name: "Doom Patrol", genres: ["Ação", "Ficção Científica", "Comédia"], producer: "HBO Max", isAnime: false, isSuperhero: true },
  { name: "Peacemaker", genres: ["Ação", "Comédia", "Ficção Científica"], producer: "HBO Max", isAnime: false, isSuperhero: true },
  { name: "Legends of Tomorrow", genres: ["Ação", "Ficção Científica", "Aventura"], producer: "The CW", isAnime: false, isSuperhero: true },
  { name: "Batwoman", genres: ["Ação", "Ficção Científica", "Drama"], producer: "The CW", isAnime: false, isSuperhero: true },
  { name: "Black Lightning", genres: ["Ação", "Ficção Científica", "Drama"], producer: "The CW", isAnime: false, isSuperhero: true },

  // Animes (específico)
  { name: "The Rising of the Shield Hero", genres: ["Ação", "Aventura", "Fantasia", "Animação"], producer: "Tokyo MX", isAnime: true, isSuperhero: false },
  { name: "Sword Art Online", genres: ["Ação", "Aventura", "Ficção Científica", "Animação"], producer: "Tokyo MX", isAnime: true, isSuperhero: false },
  { name: "Naruto Shippuden", genres: ["Ação", "Aventura", "Fantasia", "Animação"], producer: "TV Tokyo", isAnime: true, isSuperhero: false },
  { name: "Demon Slayer: Kimetsu no Yaiba", genres: ["Ação", "Fantasia", "Animação"], producer: "Tokyo MX", isAnime: true, isSuperhero: false },
  { name: "Jujutsu Kaisen", genres: ["Ação", "Fantasia", "Animação"], producer: "MBS", isAnime: true, isSuperhero: false },
  { name: "Attack on Titan", genres: ["Ação", "Ficção Científica", "Animação"], producer: "MBS", isAnime: true, isSuperhero: false },
  { name: "Death Note", genres: ["Suspense", "Policial", "Animação"], producer: "NTV", isAnime: true, isSuperhero: false }
];

export default function Recommendations({ series }: RecommendationsProps) {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<TvShowSuggestion[]>([]);
  const [recommendationTitle, setRecommendationTitle] = useState<string>("Recomendações para Você");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const generateRecommendations = async () => {
      setLoading(true);
      try {
        if (series.length === 0) {
          // Fallback se não houver séries cadastradas: recomenda séries aclamadas de Drama
          setRecommendationTitle("Recomendações Populares");
          const defaultShows = ["Peaky Blinders", "Better Call Saul", "Succession", "Sherlock"];
          const defaultData = await fetchTvShowMetadata(defaultShows);
          setRecommendations(defaultData);
          return;
        }

        // 1. Calcula o peso de cada gênero e estilo baseado nas notas (estrelas)
        const genreScores: Record<string, number> = {};
        const producerScores: Record<string, number> = {};
        
        let animeRatingSum = 0;
        let animeCount = 0;
        let superheroRatingSum = 0;
        let superheroCount = 0;

        const animeRegex = /naruto|sword art|sao|nanatsu|taizai|kaisen|demon slayer|anime|manga|titan|crunchyroll|shield hero|tate no yuusha|overlord|rezero|dragon ball|one piece|bleach/i;
        const superheroRegex = /flash|arrow|titan|gotham|supergirl|shield|batman|superman|daredevil|marvel|dc\b|boys|lantern|doom patrol|legends of tomorrow|batwoman|peacemaker|avengers/i;

        series.forEach((s) => {
          // Nota padrão é 3 se não informada
          const rating = s.rating !== undefined && s.rating !== null ? s.rating : 3;
          
          // Fator de multiplicação baseado na avaliação de estrelas:
          // 5 estrelas: 2.0x (gosta muito)
          // 4 estrelas: 1.5x (gosta)
          // 3 estrelas: 1.0x (neutro)
          // 2 estrelas: 0.1x (não gostou muito)
          // 1 estrela: -1.0x (detestou - penaliza ativamente este estilo)
          // 0 estrelas: -1.5x
          let ratingMultiplier = 1.0;
          if (rating === 5) ratingMultiplier = 2.0;
          else if (rating === 4) ratingMultiplier = 1.5;
          else if (rating === 3) ratingMultiplier = 1.0;
          else if (rating === 2) ratingMultiplier = 0.1;
          else if (rating <= 1) ratingMultiplier = -1.0;

          if (s.category) {
            genreScores[s.category] = (genreScores[s.category] || 0) + ratingMultiplier;
          }
          if (s.producer) {
            producerScores[s.producer] = (producerScores[s.producer] || 0) + ratingMultiplier;
          }

          // Rastreia e acumula notas para classificar afinidades estilísticas de Animes e Heróis
          if (animeRegex.test(s.title) || s.category === "Animação") {
            animeRatingSum += rating;
            animeCount++;
          }
          if (superheroRegex.test(s.title) || s.producer === "The CW" || s.producer === "DC Comics" || s.producer === "DC") {
            superheroRatingSum += rating;
            superheroCount++;
          }
        });

        // Considera que o usuário gosta de animes ou heróis se a média de estrelas for boa (>= 3.0)
        const userLikesAnime = animeCount > 0 && (animeRatingSum / animeCount) >= 3.0;
        const userLikesSuperheroes = superheroCount > 0 && (superheroRatingSum / superheroCount) >= 3.0;

        // Determina o gênero favorito em português (com pontuação positiva)
        let favoriteGenre = "Drama";
        let maxGenreScore = -999;
        Object.entries(genreScores).forEach(([genre, score]) => {
          if (score > maxGenreScore) {
            maxGenreScore = score;
            favoriteGenre = genre;
          }
        });

        // Se o gênero principal tiver pontuação negativa/ruim, usa Drama ou Ficção Científica como padrão positivo
        if (maxGenreScore <= 0) {
          favoriteGenre = genreScores["Ficção Científica"] && genreScores["Ficção Científica"] > 0 ? "Ficção Científica" : "Drama";
        }

        // Filtro de títulos que o usuário já adicionou ao diário
        const existingTitles = new Set(series.map((s) => s.title.toLowerCase().trim()));

        // 2. Pontua os shows do catálogo curado com base no perfil do usuário
        const candidates = CURATED_CATALOG
          .filter((show) => !existingTitles.has(show.name.toLowerCase().trim())) // remove já assistidos
          .map((show) => {
            // Inicializa a pontuação com um leve fator aleatório para dinamizar as sugestões de mesma pontuação
            let score = Math.random() * 2;

            // Pontuação por Gêneros correspondentes
            show.genres.forEach((genre) => {
              if (genreScores[genre]) {
                score += genreScores[genre] * 15; // multiplica pelo peso da nota
              }
            });

            // Pontuação por Produtora correspondente
            if (show.producer && producerScores[show.producer]) {
              score += producerScores[show.producer] * 5;
            }

            // Tratamento especial para estilo Anime
            if (show.isAnime) {
              if (userLikesAnime) {
                const avgAnimeRating = animeRatingSum / animeCount;
                score += 80 * (avgAnimeRating / 5); // mais pontos se a média de estrelas for maior
              } else {
                score -= 80; // penaliza ativamente se o usuário não consome ou deu notas baixas para animes
              }
            }

            // Tratamento especial para estilo Super-herói
            if (show.isSuperhero) {
              if (userLikesSuperheroes) {
                const avgSuperheroRating = superheroRatingSum / superheroCount;
                score += 80 * (avgSuperheroRating / 5); // mais pontos se a média de estrelas for maior
              } else {
                score -= 80; // penaliza ativamente se o usuário não consome ou deu notas baixas para heróis
              }
            }

            return { show, score };
          });

        // Ordena pela maior pontuação calculada
        const sortedShows = candidates.sort((a, b) => b.score - a.score);

        // Seleciona os 4 melhores nomes de séries recomendadas
        const topShowNames = sortedShows.slice(0, 4).map((item) => item.show.name);

        // 3. Busca os dados reais e atualizados do TVmaze para exibição
        const finalData = await fetchTvShowMetadata(topShowNames);

        // Define o título dinâmico apropriado com base no gosto
        if (userLikesAnime && userLikesSuperheroes) {
          setRecommendationTitle("Recomendações de Animes & Heróis");
        } else if (userLikesAnime) {
          setRecommendationTitle("Recomendações de Anime & Fantasia");
        } else if (userLikesSuperheroes) {
          setRecommendationTitle("Recomendações de Heróis & Ação");
        } else {
          setRecommendationTitle(`Recomendações de ${favoriteGenre}`);
        }

        setRecommendations(finalRecommendationsOnly(finalData));
      } catch (error) {
        console.error("Erro ao gerar recomendações de estilo/estrelas:", error);
      } finally {
        setLoading(false);
      }
    };

    generateRecommendations();
  }, [series]);

  // Função auxiliar para buscar metadados de shows específicos no TVmaze
  const fetchTvShowMetadata = async (names: string[]): Promise<TvShowSuggestion[]> => {
    const results = await Promise.all(
      names.map(async (name) => {
        try {
          const searchRes = await tvMazeService.searchShows(name);
          if (searchRes && searchRes.length > 0) {
            const exactMatch = searchRes.find(r => r.name.toLowerCase().trim() === name.toLowerCase().trim());
            return exactMatch || searchRes[0];
          }
        } catch (e) {
          console.error(`Erro ao obter dados para a série recomendada ${name}:`, e);
        }
        return null;
      })
    );
    return results.filter((show): show is TvShowSuggestion => show !== null);
  };

  // Garante que só exibimos séries que de fato tenham imagens
  const finalRecommendationsOnly = (data: TvShowSuggestion[]): TvShowSuggestion[] => {
    return data.filter((show) => show.image !== undefined && show.image !== null);
  };

  const handleAddRecommendation = (show: TvShowSuggestion) => {
    router.push(`/cadastrar?suggestId=${show.id}&suggestName=${encodeURIComponent(show.name)}`);
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center py-6 gap-2">
        <CircularProgress size={20} />
        <Typography variant="body2" className="text-gray-500">Calculando recomendações baseadas no seu estilo e avaliações...</Typography>
      </Box>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Box className="mb-8">
      <Box className="flex items-center gap-2 mb-4">
        <FavoriteIcon color="error" fontSize="small" />
        <Typography variant="h6" className="font-bold text-zinc-900 dark:text-zinc-100">
          {recommendationTitle}
        </Typography>
        <Tooltip title="Recomendações baseadas nas estrelas: suas séries melhor avaliadas elevam a pontuação de séries semelhantes no nosso catálogo, enquanto séries mal avaliadas (1 ou 2 estrelas) reduzem e ocultam sugestões deste estilo.">
          <InfoOutlinedIcon fontSize="small" className="text-gray-400 cursor-pointer hover:text-gray-600" />
        </Tooltip>
      </Box>

      <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {recommendations.map((show, idx) => (
          <motion.div
            key={show.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <Card className="h-full flex flex-col justify-between shadow hover:shadow-md border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-800">
              <Box className="relative w-full h-44 bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center overflow-hidden">
                {show.image ? (
                  <img
                    src={show.image}
                    alt={show.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Typography variant="caption" className="text-gray-500">Sem Foto</Typography>
                )}
                <Box className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 to-transparent p-3 pt-6">
                  <Typography variant="subtitle2" className="text-white font-bold truncate">
                    {show.name}
                  </Typography>
                </Box>
              </Box>
              
              <CardContent className="p-3 flex flex-col gap-2 flex-grow justify-between">
                <Box>
                  <Typography variant="caption" className="text-gray-500 dark:text-zinc-400 block truncate">
                    Produtora: {show.producer}
                  </Typography>
                  {show.premiered && (
                    <Typography variant="caption" className="text-gray-400 dark:text-zinc-500 block">
                      Ano: {show.premiered.substring(0, 4)}
                    </Typography>
                  )}
                </Box>
                
                <Button
                  size="small"
                  variant="outlined"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => handleAddRecommendation(show)}
                  className="w-full mt-2 text-xs font-semibold normal-case"
                >
                  Adicionar Diário
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Box>
    </Box>
  );
}
