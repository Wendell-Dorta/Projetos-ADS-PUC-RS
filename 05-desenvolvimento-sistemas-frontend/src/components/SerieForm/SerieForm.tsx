"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serieSchema, SerieFormData } from "@/schemas/serieSchema";
import { TextField, Button, Box, MenuItem, Card, CardContent, Alert } from "@mui/material";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface SerieFormProps {
  initialData?: SerieFormData;
  onSubmit: (data: SerieFormData) => void;
}

const CATEGORIAS = ["Drama", "Comédia", "Ficção Científica", "Ação", "Documentário", "Animação"];

export default function SerieForm({ initialData, onSubmit }: SerieFormProps) {
  const router = useRouter();
  
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<SerieFormData>({
    resolver: zodResolver(serieSchema),
    defaultValues: { 
      title: "",
      seasons: 1,
      releaseDate: "",
      director: "",
      producer: "",
      category: "",
      watchedDate: ""
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const handleFormSubmit = (data: SerieFormData) => {
    onSubmit(data);
    toast.success("Série salva com sucesso!");
    router.push("/series");
  };

  return (
    <Card className="max-w-3xl mx-auto shadow-lg">
      <CardContent className="p-8">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-6">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <TextField
              label="Título da Série *"
              {...register("title")}
              error={!!errors.title}
              helperText={errors.title?.message}
              className="md:col-span-8"
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
              slotProps={{ inputLabel: { shrink: true } }}
              {...register("releaseDate")}
              error={!!errors.releaseDate}
              helperText={errors.releaseDate?.message}
            />
            <TextField
              label="Data em que Assistiu *"
              type="date"
              slotProps={{ inputLabel: { shrink: true } }}
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
  );
}
