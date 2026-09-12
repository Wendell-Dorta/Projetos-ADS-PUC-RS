"use client";

import { Suspense } from "react";
import { Typography, Container } from "@mui/material";
import SerieForm from "@/components/SerieForm/SerieForm";
import { useSeries } from "@/hooks/useSeries";
import { useSearchParams } from "next/navigation";
import { Serie } from "@/types/serie";

function CadastrarPageContent() {
  const searchParams = useSearchParams();
  const idToEdit = searchParams.get("id");
  const { addSerie, updateSerie, getSerieById } = useSeries();

  let initialData: Serie | undefined;
  if (idToEdit) {
    initialData = getSerieById(idToEdit);
  }

  const handleSubmit = (data: any) => {
    if (idToEdit) {
      updateSerie(idToEdit, data);
    } else {
      addSerie(data);
    }
  };

  return (
    <Container maxWidth="md" className="pt-6">
      <Typography variant="h4" color="primary.dark" className="font-bold mb-2">
        {idToEdit ? "Editar Série" : "Cadastrar Nova Série"}
      </Typography>
      <Typography variant="subtitle1" className="text-gray-500 mb-8">
        Preencha os dados da série que você assistiu
      </Typography>

      <SerieForm initialData={initialData as any} onSubmit={handleSubmit} />
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