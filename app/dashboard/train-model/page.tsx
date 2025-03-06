import ModelTrainingForm from "./_components/ModelTrainingForm"

import { PageHeader } from "@/components/header"

const TrainModelPage = async () => {
    return (
        <section className="custom-container mx-auto w-full">
            <PageHeader 
                subtitle="Upload your dataset and configure the training settings to create your own AI model." 
                title="Train Your Model" 
            />

            <ModelTrainingForm />
        </section>
    )
}

export default TrainModelPage
