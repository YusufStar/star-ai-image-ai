import { NextResponse } from "next/server";
import Replicate from "replicate";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId") ?? "";
    const modelName = url.searchParams.get("modelName") ?? "";
    const fileName = url.searchParams.get("fileName") ?? "";

    const id = req.headers.get("webhook-id") ?? "";
    const timestamp = req.headers.get("webhook-timestamp") ?? "";
    const webhookSignature = req.headers.get("webhook-signature") ?? "";

    const signedContent = `${id}.${timestamp}.${JSON.stringify(body)}`;
    const secret = await replicate.webhooks.default.secret.get();
    const secretBytes = new Uint8Array(
      Buffer.from(secret.key.split("_")[1], "base64")
    );
    const signature = crypto
      .createHmac("sha256", secretBytes)
      .update(signedContent)
      .digest("base64");

    const expectedSignatures = webhookSignature
      .split(" ")
      .map((sig) => sig.split(",")[1]);
    const isValid = expectedSignatures.some((sig) => sig === signature);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const { data: userData, error: userError } =
      await supabaseAdmin.auth.admin.getUserById(userId);

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (userError) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userEmail = userData.user?.email ?? "";
    const username = userData.user?.user_metadata.full_name ?? "";

    console.log("Webhook received for model: ", modelName);
    console.log("User email: ", userEmail);
    console.log("Username: ", username);
    console.log("File name: ", fileName);

    if (body.status === "succeeded") {
      // send a successful status email
      // update the supabase models table
    } else {
        // handle the failed and the canceled status
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.log("Webhook processing error: ", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
