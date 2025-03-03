"use server"

import { getUser } from "./auth-actions"

import { supabaseAdmin } from "@/lib/supabase/admin"

export async function getPresignedStoragUrl(filePath: string) {
    const { data: { user } } = await getUser()
    const { data: urlData, error } = await supabaseAdmin.storage.from("training_data").createSignedUploadUrl(`${user?.id}/${new Date().getTime()}_${filePath}`)

    return {
        signedUrl: urlData?.signedUrl || "",
        error: error?.message || null
    }
}