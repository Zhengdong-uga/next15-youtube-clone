import { NextRequest, NextResponse } from "next/server";
import { trpc } from "@/trpc/server";

export const POST = async (
  request: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) => {
  const { videoId } = await params;

  try {
    const result = await trpc.videos.syncMuxStatus({ videoId });

    return NextResponse.json({ success: true, video: result });
  } catch (error) {
    console.error("Sync failed:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
};
