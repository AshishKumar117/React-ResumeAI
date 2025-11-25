import { connectToDB } from "@/lib/mongoose";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

// Secured health endpoint. Set HEALTH_ENDPOINT_SECRET in Vercel env vars.
export async function GET(request: Request) {
  try {
    const secret = process.env.HEALTH_ENDPOINT_SECRET;
    const headerSecret = request.headers.get("x-health-secret");

    if (secret) {
      if (!headerSecret || headerSecret !== secret) {
        return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
      }
    }

    await connectToDB();

    // Do a lightweight DB check
    const admin = mongoose.connection.db.admin();
    const ping = await admin.ping();

    return NextResponse.json({ ok: true, ping });
  } catch (error: any) {
    console.error("Health check failed:", error?.message || error);
    return NextResponse.json(
      { ok: false, error: error?.message || String(error) },
      { status: 500 }
    );
  }
}
