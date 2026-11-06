import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({
    configured: Boolean(process.env.UMBRA_API_KEY),
    endpoints: ["/api/v1/audiences", "/api/v1/youtube", "/api/v1/titles"],
  });
}
