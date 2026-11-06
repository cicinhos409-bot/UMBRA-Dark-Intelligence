import { NextResponse } from "next/server";
import { authorizeApiRequest } from "@/lib/api-auth";
import { GET as getYouTubeVideos } from "../../youtube/route";

export async function GET(request) {
  const unauthorized = authorizeApiRequest(request);
  if (unauthorized) return unauthorized;

  const videoType = new URL(request.url).searchParams.get("videoType") || "all";
  if (!["all", "shorts", "long"].includes(videoType)) {
    return NextResponse.json({ error: "videoType deve ser all, shorts ou long." }, { status: 400 });
  }

  const response = await getYouTubeVideos(request);
  if (!response.ok || videoType === "all") return response;

  const data = await response.json();
  const items = (data.items || []).filter((video) => {
    const duration = video.contentDetails?.duration;
    const match = typeof duration === "string"
      ? duration.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/)
      : null;
    if (!match) return false;
    const seconds = Number(match[1] || 0) * 3600 + Number(match[2] || 0) * 60 + Number(match[3] || 0);
    return videoType === "shorts" ? seconds <= 180 : seconds > 180;
  });

  return NextResponse.json({ ...data, items, videoType });
}
