import { PageHeader } from "@/components/header"

const TrainModelPage = async () => {
    return (
        <section className="container mx-auto">
            <PageHeader 
                subtitle="Upload your dataset and configure the training settings to create your own AI model." 
                title="Train Your Model" 
            />
        </section>
    )
}

export default TrainModelPage
