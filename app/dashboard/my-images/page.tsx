import GalleryComponent from "./_components/GalleryComponent"

import { getImages } from "@/actions/image-actions"
import { PageHeader } from "@/components/header"

const Gallery = async () => {
    const { data: images } = await getImages()

    return (
        <section className="container mx-auto">
            <PageHeader subtitle="Here you can see all the images you have generated. Click on an image to view details." title="My Images" />

            <GalleryComponent images={images || []} />
        </section>
    )
}

export default Gallery