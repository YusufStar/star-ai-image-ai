"use server";

import { randomUUID } from "crypto";

import { z } from "zod";
import Replicate from "replicate";
import { imageMeta } from "image-meta";

import { getUser } from "./auth-actions";

import { ImageGenerationFormSchema } from "@/app/dashboard/generate-image/_components/ConfigurationsForm";
import { createClient } from "@/lib/supabase/server";
import { Database } from "@/database.type";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  useFileOutput: false,
});

interface ImageResponse {
  error: string | null;
  success: boolean;
  data: any | null;
}

export async function generateImage(
  input: z.infer<typeof ImageGenerationFormSchema>
): Promise<ImageResponse> {
  try {
    if (!process.env.REPLICATE_API_TOKEN) {
      return {
        error: "Replicate API token is not set",
        success: false,
        data: null,
      };
    }

    const modelInput = input.model.startsWith("yusufstar")
      ? {
          model: "dev",
          prompt: input.prompt,
          lora_scale: 1,
          guidance: input.guidance,
          num_outputs: input.num_outputs,
          aspect_ratio: input.aspect_ratio,
          output_format: input.output_format,
          output_quality: input.output_quality,
          prompt_strength: input.prompt_strength,
          num_inference_steps: input.num_inference_steps,
          extra_lora_scale: 0,
        }
      : input;

    const output = await replicate.run(
      input.model as `${string}/${string}`,
      { input: modelInput }
    );

    // Process each output item to add width and height
    const processedOutput = await Promise.all(
      (output as string[]).map(async (url) => {
        const arrayBuffer = await imgUrlToBlog(url);
        const { width, height } = imageMeta(new Uint8Array(arrayBuffer));

        return {
          url,
          width,
          height,
        };
      })
    );

    return {
      error: null,
      success: true,
      data: processedOutput,
    };
  } catch (error: any) {
    return {
      error: error.message || "Failed to generate image!",
      success: false,
      data: null,
    };
  }
}

export async function imgUrlToBlog(url: string) {
  const response = fetch(url);
  const blob = (await response).blob();

  return (await blob).arrayBuffer();
}

type storeImageInput = {
  url: string;
  alt: string;
} & Database["public"]["Tables"]["generated_images"]["Insert"];

export async function storeImages(data: storeImageInput[]) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await getUser();

  if (!user) {
    return {
      error: "Unauthorized",
      success: false,
      data: null,
    };
  }

  const uploadResults = [];

  for (const img of data) {
    const arrayBuffer = await imgUrlToBlog(img.url);
    const { width, height, type } = imageMeta(new Uint8Array(arrayBuffer));

    const fileName = `image_${randomUUID()}.${type}`;
    const filePath = `${user.id}/${fileName}`;

    const { error: storageError } = await supabase.storage
      .from("generated_images")
      .upload(filePath, arrayBuffer, {
        contentType: `image/${type}`,
        cacheControl: "3600",
        upsert: false,
      });

    if (storageError) {
      uploadResults.push({
        fileName,
        error: storageError.message,
        success: false,
        data: null,
      });
      continue;
    }

    const { error: dbError, data: dbData } = await supabase
      .from("generated_images")
      .insert([
        {
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
          width: width,
        },
      ])
      .select();

    if (dbError) {
      uploadResults.push({
        fileName,
        error: dbError.message,
        success: false,
        data: dbData || null,
      });
    }

    return {
      error: null,
      success: true,
      data: { results: uploadResults },
    };
  }
}

export async function getImages(limit?: number) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await getUser();

  if (!user) {
    return {
      error: "Unauthorized",
      success: false,
      data: null,
    };
  }

  let query = supabase
    .from("generated_images")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    return {
      error: error.message || "Failed to fetch images!",
      success: false,
      data: null,
    };
  }

  const imagesWithUrls = await Promise.all(
    data.map(
      async (
        image: Database["public"]["Tables"]["generated_images"]["Row"]
      ) => {
        const { data } = await supabase.storage
          .from("generated_images")
          .createSignedUrl(`${user.id}/${image.image_name}`, 3600);

        return {
          ...image,
          url: data?.signedUrl,
        };
      }
    )
  );

  return {
    error: null,
    success: true,
    data: imagesWithUrls,
  };
}

export async function deleteImage(imageId: number, imageName: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await getUser();

  if (!user) {
    return {
      error: "Unauthorized",
      success: false,
      data: null,
    };
  }

  // First, delete the image from storage
  const { error: storageError } = await supabase.storage
    .from("generated_images")
    .remove([`${user.id}/${imageName}`]);

  if (storageError) {
    return {
      error: `Failed to delete image from storage: ${storageError.message}`,
      success: false,
      data: null,
    };
  }

  // Then, delete the record from the database
  const { error: dbError } = await supabase
    .from("generated_images")
    .delete()
    .eq("id", imageId)
    .eq("user_id", user.id);

  if (dbError) {
    return {
      error: `Failed to delete image record: ${dbError.message}`,
      success: false,
      data: null,
    };
  }

  return {
    error: null,
    success: true,
    data: null,
  };
}
