import ConfigurationsForm from "./_components/ConfigurationsForm"
import GeneratedImages from "./_components/GeneratedImages"

const GenerateImage = () => {
    return (
        <section className="container mx-auto grid gap-4 grid-cols-1 pb-[4.5rem] md:grid-cols-3 h-full overflow-y-auto">
            <ConfigurationsForm />

            <div className="col-span-1 md:col-span-2 p-4 rounded-xl flex items-center justify-center">
                <GeneratedImages />
            </div>
        </section>
    )
}

export default GenerateImage