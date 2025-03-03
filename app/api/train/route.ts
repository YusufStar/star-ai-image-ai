import { NextRequest, NextResponse } from "next/server";

import { getUser } from "@/actions/auth-actions";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
})

const WEBHOOK_URL = process.env.SITE_URL ?? "https://59d5-213-14-147-186.ngrok-free.app"

export async function POST(req: NextRequest) {
    try {
        if (!process.env.REPLICATE_API_TOKEN) {
            throw new Error("Replicate API token is not set")
        }

        const supabase = await createClient()
        const { data: { user } } = await getUser()

        if (!user) {
            return NextResponse.json({
                error: "Unauthorized"
            }, { status: 401 })
        }

        const formData = await req.formData()
        const input = {
            fileKey: formData.get("fileKey") as string,
            modelName: formData.get("modelName") as string,
            gender: formData.get("gender") as string,
        }

        if (!input.fileKey || !input.modelName || !input.gender) {
            return NextResponse.json({
                error: "Missing required fields"
            }, { status: 400 })
        }
        const fileName = input.fileKey.replace("training_data/", "")
        const { data: fileData, error } = await supabaseAdmin.storage.from("training_data").createSignedUrl(fileName, 3600)

        if (!fileData?.signedUrl) {
            throw new Error("Failed to generate signed URL for training data!")
        }

        // const hardware = await replicate.hardware.list()

        const modelId = `${user.id}_${Date.now()}_${input.modelName.toLowerCase().replaceAll(" ", "_")}`

        await replicate.models.create("yusufstar", modelId, {
            visibility: "private",
            hardware: "gpu-a100-large"
        })

        const training = await replicate.trainings.create(
            "ostris",
            "flux-dev-lora-trainer",
            "b6af14222e6bd9be257cbc1ea4afda3cd0503e1133083b9d1de0364d8568e6ef",
            {
                // You need to create a model on Replicate that will be the destination for the trained version.
                destination: `yusufstar/${modelId}`,
                input: {
                    steps: 1200,
                    resolution: "1024",
                    input_images: fileData.signedUrl,
                    trigger_word: "ohwx",
                },
                webhook: `${WEBHOOK_URL}/api/webhooks/training`,
                webhook_events_filter: ["completed"]
            }
        );

        await supabaseAdmin.from("models").insert({
            model_id: modelId,
            user_id: user.id,
            model_name: input.modelName,
            gender: input.gender,
            training_status: training.status,
            trigger_word: "ohwx",
            training_steps: 1200,
            training_id: training.id
        })

        return NextResponse.json({
            success: true,
        }, { status: 200 })
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"

        return NextResponse.json({
            error: errorMessage
        }, { status: 500 })
    }
}
