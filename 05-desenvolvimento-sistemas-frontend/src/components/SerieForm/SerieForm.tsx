"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serieSchema, SerieFormData } from "@/schemas/serieSchema";
import { TextField, Button, Box, MenuItem, Card, CardContent, Alert, Rating, Typography, Autocomplete, CircularProgress } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { tvMazeService, TvShowSuggestion } from "@/services/tvMazeService";
import { motion } from "framer-motion";
import { playSound } from "@/services/soundEffects";

interface SerieFormProps {
  initialData?: SerieFormData;
  onSubmit: (data: SerieFormData) => void;
}

const CATEGORIAS = ["Drama", "Comédia", "Ficção Científica", "Ação", "Documentário", "Animação"];

export default function SerieForm({ initialData, onSubmit }: SerieFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const getLocalDateStr = () => {
    const localDate = new Date();
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, "0");
    const day = String(localDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const todayStr = getLocalDateStr();
  
  const { register, handleSubmit, control, reset, setValue, watch, formState: { errors } } = useForm<SerieFormData>({
    resolver: zodResolver(serieSchema),
    defaultValues: { 
      title: "",
      seasons: 1,
      releaseDate: "",
      director: "",
      producer: "",
      category: "",
      watchedDate: "",
      rating: 0,
      status: "Finalizada"
    },
  });

  const currentStatus = watch("status");

  useEffect(() => {
    if (currentStatus === "Planejando" || currentStatus === "Abandonada") {
      setValue("rating", 0, { shouldValidate: true });
    }
  }, [currentStatus, setValue]);

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<TvShowSuggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let active = true;

    if (searchQuery.trim().length < 2) {
      setOptions([]);
      return undefined;
    }

    setLoadingSuggestions(true);
    const delayDebounceFn = setTimeout(async () => {
      const results = await tvMazeService.searchShows(searchQuery);
      if (active) {
        setOptions(results);
        setLoadingSuggestions(false);
      }
    }, 450); // Debounce de 450ms

    return () => {
      active = false;
      clearTimeout(delayDebounceFn);
    };
  }, [searchQuery]);

  const handleSelectShow = async (show: TvShowSuggestion | null) => {
    if (!show) return;

    setLoadingSuggestions(true);
    try {
      const details = await tvMazeService.getShowDetails(show.id, show.name);
      setValue("title", details.title);
      setValue("seasons", details.seasons);
      setValue("releaseDate", details.releaseDate);
      setValue("category", details.category);
      setValue("producer", details.producer);
      setValue("director", details.director);
      toast.success("Campos preenchidos automaticamente!");
    } catch (err) {
      toast.error("Erro ao preencher dados automáticos da série.");
    } finally {
      setLoadingSuggestions(false);
    }
  };

  useEffect(() => {
    const suggestId = searchParams.get("suggestId");
    const suggestName = searchParams.get("suggestName");
    if (suggestId && suggestName) {
      handleSelectShow({
        id: Number(suggestId),
        name: suggestName,
        premiered: null,
        genres: [],
        producer: ""
      });
    }
  }, [searchParams]);

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (data: SerieFormData) => {
    try {
      await onSubmit(data);
      playSound("success");
      toast.success("Série salva com sucesso!");
      router.push("/series");
    } catch (err) {
      toast.error("Erro ao salvar série na API.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-6" noValidate>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <Autocomplete
                freeSolo
                options={options}
                loading={loadingSuggestions}
                getOptionLabel={(option) => {
                  if (typeof option === "string") return option;
                  return option.name;
                }}
                filterOptions={(x) => x} // API já filtra os resultados
                onInputChange={(_, newInputValue) => {
                  setSearchQuery(newInputValue);
                  setValue("title", newInputValue, { shouldValidate: true });
                }}
                onChange={(_, newValue) => {
                  if (typeof newValue === "string") {
                    setValue("title", newValue, { shouldValidate: true });
                  } else if (newValue) {
                    setValue("title", newValue.name, { shouldValidate: true });
                    handleSelectShow(newValue);
                  }
                }}
                className="md:col-span-8"
                renderInput={(params) => {
                  const anyParams = params as any;
                  const inputProps = params.slotProps?.input || anyParams.InputProps || {};
                  const registeredProps = register("title");
                  return (
                    <TextField
                      {...params}
                      label="Título da Série *"
                      error={!!errors.title}
                      helperText={errors.title?.message}
                      inputRef={(node) => {
                        // Chama a ref do Autocomplete para o input
                        const autoRef = params.slotProps?.htmlInput?.ref || anyParams.inputProps?.ref;
                        if (typeof autoRef === 'function') {
                          autoRef(node);
                        } else if (autoRef) {
                          autoRef.current = node;
                        }
                        // Chama a ref do React Hook Form
                        registeredProps.ref(node);
                      }}
                      slotProps={{
                        htmlInput: {
                          ...anyParams.inputProps,
                          name: registeredProps.name,
                          onBlur: (e: any) => {
                            const autoOnBlur = params.slotProps?.htmlInput?.onBlur || anyParams.inputProps?.onBlur;
                            autoOnBlur?.(e);
                            registeredProps.onBlur(e);
                          },
                          onChange: (e: any) => {
                            const autoOnChange = params.slotProps?.htmlInput?.onChange || anyParams.inputProps?.onChange;
                            autoOnChange?.(e);
                            registeredProps.onChange(e);
                          },
                        },
                        input: {
                          ...inputProps,
                          endAdornment: (
                            <>
                              {loadingSuggestions ? <CircularProgress color="inherit" size={20} /> : null}
                              {inputProps.endAdornment}
                            </>
                          ),
                        },
                      }}
                    />
                  );
                }}
                renderOption={(props, option) => {
                  const { key, ...optionProps } = props;
                  return (
                    <li {...optionProps} key={option.id}>
                      <Box className="flex items-center gap-3 py-1">
                        {option.image ? (
                          <img
                            src={option.image}
                            alt={option.name}
                            className="w-10 h-14 object-cover rounded shadow"
                          />
                        ) : (
                          <Box className="w-10 h-14 bg-gray-200 dark:bg-zinc-700 rounded flex items-center justify-center text-[10px] text-gray-500">
                            Sem foto
                          </Box>
                        )}
                        <Box className="flex flex-col">
                          <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{option.name}</span>
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            {option.premiered ? option.premiered.substring(0, 4) : "Lançamento N/A"} • {option.producer}
                          </span>
                        </Box>
                      </Box>
                    </li>
                  );
                }}
              />
              <TextField
                label="Temporadas *"
                type="number"
                {...register("seasons", { valueAsNumber: true })}
                error={!!errors.seasons}
                helperText={errors.seasons?.message}
                className="md:col-span-4"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* O Controller resolve perfeitamente a briga entre o Select do MUI e o Hook Form */}
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Categoria *"
                    error={!!errors.category}
                    helperText={errors.category?.message}
                  >
                    {CATEGORIAS.map((cat) => (
                      <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <TextField
                label="Data de Lançamento *"
                type="date"
                slotProps={{ 
                  inputLabel: { shrink: true },
                  htmlInput: { max: todayStr }
                }}
                {...register("releaseDate")}
                error={!!errors.releaseDate}
                helperText={errors.releaseDate?.message}
              />
              <TextField
                label="Data em que Assistiu *"
                type="date"
                slotProps={{ 
                  inputLabel: { shrink: true },
                  htmlInput: { max: todayStr }
                }}
                {...register("watchedDate")}
                error={!!errors.watchedDate}
                helperText={errors.watchedDate?.message}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Diretor *"
                {...register("director")}
                error={!!errors.director}
                helperText={errors.director?.message}
              />
              <TextField
                label="Produtora *"
                {...register("producer")}
                error={!!errors.producer}
                helperText={errors.producer?.message}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Box className="flex flex-col gap-2">
                <Typography component="legend" className="text-gray-700 dark:text-gray-300 font-medium">
                  Sua Avaliação (Estrelas)
                </Typography>
                <Controller
                  name="rating"
                  control={control}
                  render={({ field }) => (
                    <Rating
                      {...field}
                      value={Number(field.value) || 0}
                      onChange={(_, newValue) => field.onChange(newValue || 0)}
                      size="large"
                      disabled={currentStatus === "Planejando" || currentStatus === "Abandonada"}
                    />
                  )}
                />
                {(currentStatus === "Planejando" || currentStatus === "Abandonada") && (
                  <Typography variant="caption" className="text-zinc-500 dark:text-zinc-400 italic">
                    {currentStatus === "Planejando"
                      ? "Nota indisponível para séries em planejamento."
                      : "Séries abandonadas recebem automaticamente nota zero."}
                  </Typography>
                )}
              </Box>

              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Status da Série *"
                    error={!!errors.status}
                    helperText={errors.status?.message}
                    fullWidth
                  >
                    <MenuItem value="Assistindo">Assistindo</MenuItem>
                    <MenuItem value="Finalizada">Finalizada</MenuItem>
                    <MenuItem value="Planejando">Planejando Assistir</MenuItem>
                    <MenuItem value="Abandonada">Abandonada</MenuItem>
                  </TextField>
                )}
              />
            </div>

            <Alert severity="info" className="my-2">
              Dica: Todos os campos marcados com asterisco (*) são obrigatórios.
            </Alert>

            <Box className="flex justify-end gap-4 mt-4">
              <Button variant="outlined" color="primary" onClick={() => router.push("/series")}>
                Cancelar
              </Button>
              <Button type="submit" variant="contained" color="primary">
                {initialData ? "Atualizar Série" : "Cadastrar Série"}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
