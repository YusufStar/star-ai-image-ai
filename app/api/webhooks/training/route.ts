import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        console.log("Webhook is good!", body)

        return NextResponse.json({ success: true }, { status: 201 })
    } catch (error) {
        console.log("Webhook processing error: ", error)
        
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}