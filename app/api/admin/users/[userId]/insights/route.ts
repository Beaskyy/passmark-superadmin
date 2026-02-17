import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const getApiUrl = () => {
  const raw = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "";
  const url = raw.trim().replace(/\/+$/, "");
  if (!url) throw new Error("API_URL or NEXT_PUBLIC_API_URL is not set");
  return url;
};

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = params;
    const apiUrl = getApiUrl();
    const insightsUrl = `${apiUrl}/admin-api/users/${userId}/insights/`;

    const res = await fetch(insightsUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      cache: "no-cache",
    });

    const contentType = res.headers.get("content-type");
    const rawBody = await res.text();

    if (!contentType?.includes("application/json")) {
      console.error("[User Insights API] Non-JSON response:", res.status, rawBody.substring(0, 200));
      return NextResponse.json(
        { error: "Invalid response from server" },
        { status: 502 }
      );
    }

    let data: Record<string, unknown>;
    try {
      data = JSON.parse(rawBody) as Record<string, unknown>;
    } catch {
      console.error("[User Insights API] Invalid JSON:", rawBody.substring(0, 200));
      return NextResponse.json(
        { error: "Invalid response from server" },
        { status: 502 }
      );
    }

    if (!res.ok) {
        const message = (data.detail as string) ?? (data.message as string) ?? "Failed to fetch user insights";
        return NextResponse.json({ error: message }, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("[User Insights API] Request failed:", err);
    return NextResponse.json(
      { error: "Failed to fetch user insights" },
      { status: 500 }
    );
  }
}
