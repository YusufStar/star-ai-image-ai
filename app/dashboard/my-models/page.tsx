import React from "react";

import ModelList from "./_components/model-list";

import { fetchModels } from "@/actions/model-actions";
import { PageHeader } from "@/components/header";

const ModelsPage = async () => {
  const data = await fetchModels();

  return (
    <section className="custom-container mx-auto">
      <PageHeader
        subtitle="View and manage your trained models."
        title="My Models"
      />

      <ModelList initialData={data}/>
    </section>
  );
};

export default ModelsPage;
