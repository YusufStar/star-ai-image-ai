import { getUser } from "@/actions/auth-actions";
import { PageHeader } from "@/components/header";
import React from "react";
import { StatsCard } from "./_components/StatsCard";
import { fetchModels } from "@/actions/model-actions";
import { getCredits } from "@/actions/credit-actions";
import { getImages } from "@/actions/image-actions";

async function page() {
  const {
    data: { user },
  } = await getUser();
  const { data: models, count: modelsCount } = await fetchModels();
  const { data: credits } = await getCredits();
  const { data: images } = await getImages();

  const imageCount = images?.length || 0;
  
  // Enhance models with additional properties if needed
  const enhancedModels = models?.map(model => ({
    ...model,
    name: model.model_name,
  })) || [];

  return (
    <section className="custom-container mx-auto flex-1">
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back, ${user?.user_metadata.full_name}`}
      />

      <StatsCard
        models={enhancedModels}
        images={images?.slice(0, 6) ?? []}
        imageCount={imageCount}
        modelCount={modelsCount}
        credits={credits}
      />
    </section>
  );
}

export default page;
