import ConfigurationsForm from "./_components/ConfigurationsForm"
import GeneratedImages from "./_components/GeneratedImages"

import { PageHeader } from "@/components/header"

const GenerateImage = () => {
    return (
        <div className="container mx-auto h-fit w-full">
            <PageHeader subtitle="Create unique AI-generated images by configuring your preferences below." title="Generate Image" />

            <section className="w-full h-fit overflow-y-auto flex flex-col-reverse xl:flex-row gap-4">
                <div className="w-full">
                    <ConfigurationsForm />
                </div>


                <div className="w-full p-4 rounded-xl flex items-center justify-center">
                    <GeneratedImages />
                </div>
            </section>
        </div>
    )
}

export default GenerateImage