"use client";

import { Suspense } from "react";
import { Typography, Container } from "@mui/material";
import SerieForm from "@/components/SerieForm/SerieForm";
import SerieFormSkeleton from "@/components/SerieForm/SerieFormSkeleton";
import { useSeries } from "@/hooks/useSeries";
import { useSearchParams } from "next/navigation";
import { Serie } from "@/types/serie";

function CadastrarPageContent() {
  const searchParams = useSearchParams();
  const idToEdit = searchParams.get("id");
  const { addSerie, updateSerie, getSerieById, isLoading, error } = useSeries();

  let initialData: Serie | undefined;
  if (idToEdit) {
    initialData = getSerieById(idToEdit);
  }

  const handleSubmit = async (data: any) => {
    if (idToEdit) {
      await updateSerie(idToEdit, data);
    } else {
      await addSerie(data);
    }
  };

  return (
    <Container maxWidth="md" className="pt-6">
      {isLoading && idToEdit && !initialData ? (
        <SerieFormSkeleton />
      ) : error ? (
        <Typography color="error" className="text-center mt-10">{error}</Typography>
      ) : (
        <>
          <Typography variant="h4" color="text.primary" className="font-bold mb-2">
            {idToEdit ? "Editar Série" : "Cadastrar Nova Série"}
          </Typography>
          <Typography variant="subtitle1" className="text-gray-500 dark:text-gray-400 mb-8">
            Preencha os dados da série que você assistiu
          </Typography>

          <SerieForm initialData={initialData as any} onSubmit={handleSubmit} />
        </>
      )}
    </Container>
  );
}

export default function CadastrarPage() {
  return (
    <Suspense fallback={<div>Carregando formulário...</div>}>
      <CadastrarPageContent />
    </Suspense>
  );
}