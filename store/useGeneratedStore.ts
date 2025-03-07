import { z } from "zod";
import { create } from "zustand"

import { generateImage, storeImages } from "@/actions/image-actions";
import { ImageGenerationFormSchema } from "@/app/dashboard/generate-image/_components/ConfigurationsForm";

interface GenerateState {
    loading: boolean;
    images: Array<{ url: string, alt: string; width: number; height: number; }>
    error: string | null;
    generateImage: (values: z.infer<typeof ImageGenerationFormSchema>) => Promise<void>
}

const useGeneratedStore = create<GenerateState>((set) => ({
    loading: false,
    images: [],
    error: null,

    generateImage: async (values: z.infer<typeof ImageGenerationFormSchema>) => {
        set({ loading: true, error: null, images: [] })

        try {
            const { error, data, success } = await generateImage(values)

            if (!success) {
                set({ error: error, loading: false })

                return
            }

            const dataWithUrl = data.map(({ url, height, width }: {
                url: string;
                width: number;
                height: number;
            }) => {
                return {
                    url,
                    width,
                    height,
                    alt: "Generated Image",
                    ...values
                }
            })

            set({ images: dataWithUrl, loading: false })

            await storeImages(dataWithUrl)
        } catch (error) {
            set({ error: "Failed to generate image. Please try again", loading: false })
        }
    }
}))

export default useGeneratedStore