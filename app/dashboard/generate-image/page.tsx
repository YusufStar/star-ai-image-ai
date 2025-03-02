import ConfigurationsForm from "./_components/ConfigurationsForm"
import GeneratedImages from "./_components/GeneratedImages"

const GenerateImage = () => {
    return (
        <div className="h-full w-full">
            <section className="w-full h-full items-start [@media(min-width:2048px)]:items-center overflow-y-auto flex flex-col xl:flex-row gap-4">
                <div className="w-4/5">
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