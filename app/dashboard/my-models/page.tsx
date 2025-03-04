import { fetchModels } from "@/actions/model-actions";
import { PageHeader } from "@/components/header";
import React from "react";
import ModelList from "./_components/model-list";

const ModelsPage = async () => {
  const data = await fetchModels();

  return (
    <section className="custom-container mx-auto">
      <PageHeader
        title="My Models"
        subtitle="View and manage your trained models."
      />

      <ModelList initialData={data}/>
    </section>
  );
};

export default ModelsPage;
