import { connectToDB } from "@/lib/mongoose";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  try {
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
