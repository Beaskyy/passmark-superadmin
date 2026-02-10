import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SummaryResponse } from "@/types/api";

export async function getAdminSummary(): Promise<SummaryResponse | null> {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return null;
  }

  try {
    const baseUrl = (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");
    const url = `${baseUrl}/admin-api/summary/`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      cache: "no-cache",
    });

    if (!res.ok) {
      if (res.status === 401) return null;
      return null;
    }

    const data = (await res.json()) as SummaryResponse;
    return data?.data ? data : null;
  } catch {
    return null;
  }
}
