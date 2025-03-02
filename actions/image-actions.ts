"use server"

import { randomUUID } from 'crypto';

import { z } from 'zod';
import Replicate from 'replicate';
import { imageMeta } from 'image-meta';

import { getUser } from './auth-actions';

import { ImageGenerationFormSchema } from '@/app/dashboard/generate-image/_components/ConfigurationsForm';
import { createClient } from '@/lib/supabase/server';
import { Database } from '@/database.type';


const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
    useFileOutput: false,
})

interface ImageResponse {
    error: string | null;
    success: boolean;
    data: any | null;
}

export async function generateImage(input: z.infer<typeof ImageGenerationFormSchema>): Promise<ImageResponse> {
    try {
        const output = await replicate.run(input.model as `${string}/${string}`, { input: input })

        return {
            error: null,
            success: true,
            data: output
        };
    } catch (error: any) {
        return {
            error: error.message || "Failed to generate image!",
            success: false,
            data: null
        }
    }
}

export async function imgUrlToBlog(url: string) {
    const response = fetch(url)
    const blob = (await response).blob()

    return (await blob).arrayBuffer()
}

type storeImageInput = {
    url: string;
    alt: string;
} & Database["public"]["Tables"]["generated_images"]["Insert"]

export async function storeImages(data: storeImageInput[]) {
    const supabase = await createClient()

    const { data: { user } } = await getUser()

    if (!user) {
        return {
            error: "Unauthorized",
            success: false,
            data: null
        }
    }

    const uploadResults = []

    for (const img of data) {
        const arrayBuffer = await imgUrlToBlog(img.url)
        const { width, height, type } = imageMeta(new Uint8Array(arrayBuffer))

        const fileName = `image_${randomUUID()}.${type}`
        const filePath = `${user.id}/${fileName}`

        const { error: storageError } = await supabase.storage.from("generated_images").upload(
            filePath, arrayBuffer, {
            contentType: `image/${type}`,
            cacheControl: "3600",
            upsert: false,
        }
        )

        if (storageError) {
            uploadResults.push({
                fileName,
                error: storageError.message,
                success: false,
                data: null
            })
            continue
        }

        const { error: dbError, data: dbData } = await supabase.from("generated_images").insert([{
            image_name: fileName,
            aspect_ratio: img.aspect_ratio,
            disable_safety_checker: img.disable_safety_checker,
            go_fast: img.go_fast,
            guidance: img.guidance,
            height,
            megapixels: img.megapixels,
            model: img.model,
            num_inference_steps: img.num_inference_steps,
            num_outputs: img.num_outputs,
            output_format: img.output_format,
            output_quality: img.output_quality,
            prompt: img.prompt,
            prompt_strength: img.prompt_strength,
            user_id: user.id,
            width: width
        }]).select()

        if (dbError) {
            uploadResults.push({
                fileName,
                error: dbError.message,
                success: false,
                data: dbData || null
            })
        }

        return {
            error: null,
            success: true,
            data: { results: uploadResults }
        }
    }
}