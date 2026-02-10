"use client";

import { useQuery } from "@tanstack/react-query";
import { SummaryResponse } from "@/types/api";
import { useSession } from "next-auth/react";

async function fetchSummary(token: string): Promise<SummaryResponse> {
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");
  const res = await fetch(`${baseUrl}/admin-api/summary/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  if (!res.ok) {
    if (res.status === 401) window.location.href = "/login";
    throw new Error("Failed to fetch summary");
  }

  return res.json();
}

export function useAdminSummary() {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["admin-summary", session?.accessToken],
    queryFn: () => fetchSummary(session!.accessToken!),
    enabled: !!session?.accessToken,
    retry: 1,
  });
}
