import ConfigurationsForm from "./_components/ConfigurationsForm";
import GeneratedImages from "./_components/GeneratedImages";

import { fetchModels } from "@/actions/model-actions";
import { PageHeader } from "@/components/header";

interface SearchParams {
  model_id?: string;
}

const GenerateImage = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const model_id = await (await searchParams).model_id;
  const { data: userModels } = await fetchModels();

  return (
    <div className="custom-container mx-auto h-fit w-full">
      <PageHeader
        subtitle="Create unique AI-generated images by configuring your preferences below."
        title="Generate Image"
      />

      <section className="w-full h-fit overflow-y-auto flex flex-col-reverse xl:flex-row gap-4">
        <div className="w-full">
          <ConfigurationsForm
            model_id={model_id}
            userModels={userModels ?? []}
          />
        </div>

        <div className="w-full p-4 rounded-xl flex items-center justify-center">
          <GeneratedImages />
        </div>
      </section>
    </div>
  );
};

export default GenerateImage;
